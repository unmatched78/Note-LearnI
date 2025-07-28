from rest_framework import viewsets, status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from core.auth.authentication import ClerkAuthentication as JWTAuthentication
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import  *
from .serializers import*
from .utils.file_processing import extract_text_from_file, split_text_into_chunks
from .utils.quiz_utils import generate_questions_from_text, evaluate_answers_logic
from rest_framework.permissions import IsAuthenticated
from .api.responses import error_response
from django.utils.decorators import method_decorator
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
import logging, os, json
from .auth import authemail, authentication, webhooks
logger = logging.getLogger(__name__)
User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        # request.user is using Django user with a clerk_id
        # pull Clerk’s metadata if any:
        data = clerk.users.get_user(user_id=request.user.clerk_id)
        serializer = self.get_serializer(request.user)
        return Response({
            "user": serializer.data,
            "clerk_profile": {
                "email": data.email_addresses[0].email_address if data.email_addresses else None,
                "first_name": data.first_name if data.first_name else None,
                "last_name": data.last_name if data.last_name else None,
            }
        })

    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return error_response(
                message="User creation failed",
                code=status.HTTP_400_BAD_REQUEST,
                details={"error": "Username already exists"},
            )
        return super().handle_exception(exc)
#we have to create a viewset for register
#here we are using the default user model
MAX_FILE_SIZE_MB = 19

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-created_at')
    serializer_class = DocumentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # override to extract text & store description
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"detail": "No file uploaded"}, status=400)

        size_mb = file_obj.size / (1024*1024)
        if size_mb > MAX_FILE_SIZE_MB:
            return Response({"detail": f"File >{MAX_FILE_SIZE_MB}MB"}, status=400)

        text = extract_text_from_file(file_obj)
        if not text:
            return Response({"detail": "Could not extract text"}, status=400)

        chunks = split_text_into_chunks(text)
        doc = Document.objects.create(
            user=request.user,
            title=file_obj.name,
            file=file_obj,
            description="\n".join(chunks)
        )

        return Response(
            {"id": doc.id, "text_chunks": chunks},
            status=status.HTTP_201_CREATED
        )

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all().order_by('-created_at')
    serializer_class = QuizSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        POST payload: {
          "document_id": int,
          "prompt": str,
          "num_questions": int
        }
        """
        doc_id = request.data.get('document_id')
        prompt = request.data.get('prompt', '')
        num_q = int(request.data.get('num_questions', 0))
        doc = Document.objects.filter(id=doc_id, user=request.user).first()
        if not doc:
            return Response({"detail": "Document not found"}, status=404)

        chunks = doc.description.splitlines()
        questions_wrapper = generate_questions_from_text(chunks, prompt, num_q)
        questions = questions_wrapper.get("questions", [])

        quiz = Quiz.objects.create(
            document=doc,
            generated_by=request.user,
            quiz_title=f"Quiz from {doc.title}",
            questions=questions_wrapper
        )
        return Response({"quiz_id": quiz.id, "questions": questions})

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all().order_by('-created_at')
    serializer_class = QuizAttemptSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        POST payload: {
          "quiz_id": int,
          "student_answers": { "Q1": "…", … }
        }
        """
        quiz_id = request.data.get('quiz_id')
        answers = request.data.get('student_answers', {})

        quiz = Quiz.objects.filter(id=quiz_id).first()
        if not quiz:
            return Response({"detail": "Quiz not found"}, status=404)

        question_list = quiz.questions.get("questions", [])
        feedback, correct, failed = evaluate_answers_logic(question_list, answers)

        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user,
            responses=answers,
            score=correct,
            total_questions=len(question_list)
        )
        # record each failed question
        for item in failed:
            FailedQuestion.objects.create(
                quiz_attempt=attempt,
                question_data={
                    "question": item["question"],
                    "options": item["options"],
                    "correct_answer": item["correct_answer"],
                },
                selected_answer=item["student_answer"]
            )

        return Response({
            "attempt_id": attempt.id,
            "feedback": feedback,
            "score": correct,
            "total": len(question_list)
        })

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all().order_by('-created_at')
    serializer_class = ModuleSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['post'])
    def add_document(self, request):
        """
        POST payload: {
          "module_id": int,
          "document_id": int,
          "created_by": int,
            "code": str,
            "title": str,
            "description": str
        }
        """
        module_id = request.data.get('module_id')
        document_id = request.data.get('document_id')

        module = get_object_or_404(Module, id=module_id, created_by=request.user)
        document = get_object_or_404(Document, id=document_id)

        module.documents.add(document)
        return Response({"detail": "Document added to module"}, status=200)
    
    @action(detail=False, methods=['post'])
    def add_quiz(self, request):
        """
        POST payload: {
          "module_id": int,
          "quiz_id": int,
        }
        """
        module_id = request.data.get('module_id')
        quiz_id = request.data.get('quiz_id')

        module = get_object_or_404(Module, id=module_id, created_by=request.user)
        document = get_object_or_404(Quiz, id=quiz_id)

        module.quiz.add(document)
        return Response({"detail": "Document added to module"}, status=200)
    
"""
   feature based classes
"""

from .utils.summarize import generate_summary
from .utils.transcribe import transcribe_media
from .utils.flashcard import generate_flashcards

