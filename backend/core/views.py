from rest_framework import viewsets, status, permissions
from rest_framework.parsers import MultiPartParser,JSONParser
from core.auth.authentication import ClerkAuthentication as JWTAuthentication
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import  *
from .serializers import*
from .utils.file_processing import extract_text_from_file, split_text_into_chunks
from .utils.quiz_utils import generate_questions_from_text, evaluate_answers_logic
from rest_framework.permissions import IsAuthenticated
from .api.responses import error_response
from django.db import IntegrityError
from django.contrib.auth import get_user_model
import logging, os, json
from django.db.models import Q
from .auth import authemail, authentication, webhooks
from .utils.summarize import generate_summary
from .utils.transcribe import transcribe_media
from .utils.flashcard import generate_flashcards
# Import Clerk SDK for API calls
from core.auth.authentication import clerk_sdk
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from .api.pagination import StandardResultsSetPagination
logger = logging.getLogger(__name__)
User = get_user_model()
import cloudinary
import cloudinary.uploader
import cloudinary.api
#we have to create a viewset for register
#here we are using the default user model
MAX_FILE_SIZE_MB = 19
# Import the CloudinaryImage and CloudinaryVideo methods for the simplified syntax used in this guide
from cloudinary import CloudinaryImage
from cloudinary import CloudinaryVideo
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        # request.user is using Django user with a clerk_id
        # pull Clerk's metadata if any:
        try:
            data = clerk_sdk.users.get_user(user_id=request.user.clerk_id)
            clerk_profile = {
                "email": data.email_addresses[0].email_address if data.email_addresses else None,
                "first_name": data.first_name if data.first_name else None,
                "last_name": data.last_name if data.last_name else None,
            }
        except Exception as e:
            logger.error(f"Failed to fetch Clerk user data: {e}")
            # Return user data without Clerk profile if API call fails
            clerk_profile = {
                "email": None,
                "first_name": None,
                "last_name": None,
            }
        
        serializer = self.get_serializer(request.user)
        return Response({
            "user": serializer.data,
            "clerk_profile": clerk_profile
        })

    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return error_response(
                message="User creation failed",
                code=status.HTTP_400_BAD_REQUEST,
                details={"error": "Username already exists"},
            )
        return super().handle_exception(exc)

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
        
        return Response({"quiz_id": quiz.id, "questions": questions_wrapper.get("questions", [])})

class ResourceSearch(mixins.ListModelMixin,viewsets.GenericViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]
    pagination_class       = StandardResultsSetPagination

    def list(self, request):
        term = request.query_params.get("search", "").strip()

        quizzes     = Quiz.objects.all()
        flashsets   = FlashcardSet.objects.all()
        summaries   = Summary.objects.all()
        transcripts = Transcript.objects.all()
        docs        = Document.objects.all()

        if term:
            quizzes     = quizzes.filter(
                Q(quiz_title__icontains=term) |
                Q(questions__icontains=term)
            )
            flashsets   = flashsets.filter(
                Q(title__icontains=term) |
                Q(cards__icontains=term)
            )
            summaries   = summaries.filter(
                Q(title__icontains=term) |
                Q(snippet__icontains=term) |
                Q(content__icontains=term)
            )
            transcripts = transcripts.filter(
                Q(title__icontains=term) |
                Q(transcript__icontains=term) |
                Q(summary__icontains=term)
            )
            docs        = docs.filter(
                Q(title__icontains=term) |
                Q(description__icontains=term)
            )

        results = []
        

        # Helpers to pull first element safely
        def first_question_text(q_field):
            if isinstance(q_field, dict):
                lst = q_field.get("questions", [])
            else:
                lst = q_field or []
            return (lst[0].get("question") if lst and isinstance(lst[0], dict) else "")[:100]

        def first_flashcard_front(cards_field):
            if isinstance(cards_field, dict):
                lst = cards_field.get("flashcard", []) or cards_field.get("cards", [])
            else:
                lst = cards_field or []
            return (lst[0].get("front") if lst and isinstance(lst[0], dict) else "")[:100]

        # Quizzes
        for q in quizzes:
            snippet = first_question_text(q.questions)
            results.append({
                "id": q.id,
                "resource_type": "quiz",
                "title": q.quiz_title or "",
                "snippet": snippet,
                "created_at": q.created_at,
            })

        # Flashcards
        for f in flashsets:
            snippet = first_flashcard_front(f.cards)
            results.append({
                "id": f.id,
                "resource_type": "flashcard",
                "title": f.title or "",
                "snippet": snippet,
                "created_at": f.created_at,
            })

        # Summaries
        for s in summaries:
            results.append({
                "id": s.id,
                "resource_type": "summary",
                "title": s.title or "",
                "snippet": s.snippet,
                "created_at": s.created_at,
            })

        # Transcripts
        for t in transcripts:
            results.append({
                "id": t.id,
                "resource_type": "transcript",
                "title": t.title or "",
                "snippet": (t.transcript or "")[:100],
                "created_at": t.created_at,
            })

        # Documents
        for d in docs:
            results.append({
                "id": d.id,
                "resource_type": "document",
                "title": d.title,
                "snippet": (d.description or "")[:100],
                "created_at": d.created_at,
            })

        # Sort by creation time descending
        results.sort(key=lambda x: x["created_at"], reverse=True)
        # paginate the Python list:
        page = self.paginate_queryset(results)
        if page is not None:
            serializer = ResourceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ResourceSerializer(results, many=True)
        return Response(serializer.data)


"""
   To be used on postgresql in production for JsonB
"""
# class ResourceSearch(viewsets.ViewSet):
#     authentication_classes = [JWTAuthentication]
#     permission_classes     = [IsAuthenticated]

#     def list(self, request):
#         term = request.query_params.get("search", "").strip()

#         # Base querysets
#         quizzes     = Quiz.objects.all()
#         flashsets   = FlashcardSet.objects.all()
#         summaries   = Summary.objects.all()
#         transcripts = Transcript.objects.all()
#         docs        = Document.objects.all()

#         if term:
#             quizzes     = quizzes.filter(
#                                 Q(quiz_title__icontains=term) |
#                                 Q(questions__contains=[{"question": term}])
#                             )
#             flashsets   = flashsets.filter(
#                                 Q(title__icontains=term) |
#                                 Q(cards__contains=[{"front": term}])
#                             )
#             summaries   = summaries.filter(
#                                 Q(title__icontains=term) |
#                                 Q(snippet__icontains=term) |
#                                 Q(content__icontains=term)
#                             )
#             transcripts = transcripts.filter(
#                                 Q(title__icontains=term) |
#                                 Q(transcript__icontains=term) |
#                                 Q(summary__icontains=term)
#                             )
#             docs        = docs.filter(
#                                 Q(title__icontains=term) |
#                                 Q(description__icontains=term)
#                             )

#         # Build a unified list
#         results = []

#         for q in quizzes:
#             results.append({
#                 "id":            q.id,
#                 "resource_type": "quiz",
#                 "title":         q.quiz_title or "",
#                 "snippet":       (q.questions[0]["question"] if q.questions else "")[:100],
#                 "created_at":    q.created_at,
#             })
#         for f in flashsets:
#             results.append({
#                 "id":            f.id,
#                 "resource_type": "flashcard",
#                 "title":         f.title or "",
#                 "snippet":       (f.cards[0]["front"] if f.cards else "")[:100],
#                 "created_at":    f.created_at,
#             })
#         for s in summaries:
#             results.append({
#                 "id":            s.id,
#                 "resource_type": "summary",
#                 "title":         s.title or "",
#                 "snippet":       s.snippet,
#                 "created_at":    s.created_at,
#             })
#         for t in transcripts:
#             results.append({
#                 "id":            t.id,
#                 "resource_type": "transcript",
#                 "title":         t.title or "",
#                 "snippet":       t.transcript[:100],
#                 "created_at":    t.created_at,
#             })
#         for d in docs:
#             results.append({
#                 "id":            d.id,
#                 "resource_type": "document",
#                 "title":         d.title,
#                 "snippet":       d.description[:100],
#                 "created_at":    d.created_at,
#             })

#         # Optionally sort by created_at descending
#         results.sort(key=lambda x: x["created_at"], reverse=True)

#         page = self.paginate_queryset(results)
#         if page is not None:
#             serializer = ResourceSerializer(page, many=True)
#             return self.get_paginated_response(serializer.data)

#         serializer = ResourceSerializer(results, many=True)
#         return Response(serializer.data)




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
    @action(detail=False, methods=["get"], url_path="progress")
    def progress(self, request):
        user = request.user
        modules = Module.objects.filter(created_by=user)
        results = []

        for module in modules:
            quizzes = module.quiz.all()
            # all quiz attempts by this user for quizzes in this module
            attempts = QuizAttempt.objects.filter(quiz__in=quizzes, student=user)

            if attempts.exists():
                total_pct = sum((a.score / a.total_questions) * 100 for a in attempts)
                avg_pct = total_pct / attempts.count()
            else:
                avg_pct = 0

            results.append({
                'moduleId': module.id,
                'title': module.title,
                'score': round(avg_pct, 2),
            })

        return Response(results)
    
"""
   feature based classes
"""


class SummaryViewSet(viewsets.ModelViewSet):
    queryset = Summary.objects.all().order_by('-created_at')
    serializer_class = SummarySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def perform_create(self, serializer):
        serializer.save(generated_by=self.request.user)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        POST payload:
          { 
            "document": <doc_id>,
            "length": "medium",
            "include_key_points": true,
            "focus_areas": "..."
          }
        """
        doc_id = request.data.get("document")
        doc = Document.objects.filter(id=doc_id, user=request.user).first()
        if not doc:
            return Response({"detail": "Document not found."}, status=404)

        length = request.data.get("length", "medium")
        include = request.data.get("include_key_points", True)
        focus = request.data.get("focus_areas", "")
        # assume doc.description holds the text chunks or full text
        chunks = doc.description.splitlines()
        summary_text = generate_summary(chunks, length, include, focus)
        title="summary for "+doc.title

        summary = Summary.objects.create(
            document=doc,
            generated_by=request.user,
            length=length,
            include_key_points=include,
            focus_areas=focus,
            content=summary_text,
            title=title
        )
        return Response(SummarySerializer(summary).data, status=201)


class TranscriptViewSet(viewsets.ModelViewSet):
    queryset = Transcript.objects.all().order_by('-created_at')
    serializer_class = TranscriptSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def generate(self, request):
        #this is for the audio
        """
        POST payload:
          {
            "audio": file,
            "language": "english",
            "speaker_identification": false,
            "generate_summary": false
          }
        """
        audio = request.data.get("audio")
        if not audio:
            return Response({"detail": "Audio file is required."}, status=400)

        lang = request.data.get("language", "english")
        speaker = request.data.get("speaker_identification", False)
        gen_sum = request.data.get("generate_summary", False)
        title= "transcript for "+audio.name 

        # if you have a URL for the file, pass that; here we'll use doc.file.url
        result = transcribe_media(audio, lang, speaker, gen_sum)
        transcript = Transcript.objects.create(
            audio_file=audio,
            generated_by=request.user,
            language=lang,
            speaker_identification=speaker,
            transcript=result["transcript"],
            summary=result.get("summary", None),
            title=title
        )
        return Response(TranscriptSerializer(transcript).data, status=201)
    @action(detail=False, methods=["post"])
    def youtube(self, request):
        #this is for youtube
        """
        POST payload:
          {
            "youtube_url": "https://www.youtube.com/watch?v=xyz123",
            "language": "en",
            "generate_summary": true
          }
        """
        from core.utils.youtube import transcribe_youtube_video
    
        url = request.data.get("youtube_url")
        if not url:
            return Response({"detail": "YouTube URL is required."}, status=400)
        title = "transcript for "+url
        
    
        language = request.data.get("language", "en")
        generate_summary = request.data.get("generate_summary", False)

        try:
           result = transcribe_youtube_video(url, language=language, generate_summary=generate_summary)
        except ValueError as ve:
          return Response({"detail": str(ve)}, status=400)
    
        transcript = Transcript.objects.create(
            media_url=url,
            generated_by=request.user,
            language=language,
            speaker_identification=False,
            transcript=result["transcript"],
            summary=result.get("summary", None),
            title=title
        )
    
        return Response(TranscriptSerializer(transcript).data, status=201)


class FlashcardViewSet(viewsets.ModelViewSet):
    queryset = FlashcardSet.objects.all().order_by('-created_at')
    serializer_class = FlashcardSetSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        POST payload:
          {
            "document": <doc_id>,
            "num_cards": 10,
            "difficulty": "medium",
            "focus_topics": ""
          }
        """
        doc = Document.objects.filter(
            id=request.data.get("document"), user=request.user
        ).first()
        if not doc:
            return Response({"detail": "Document not found."}, status=404)

        n = int(request.data.get("num_cards", 10))
        diff = request.data.get("difficulty", "medium")
        focus = request.data.get("focus_topics", "")

        chunks = doc.description.splitlines()
        cards = generate_flashcards(chunks, n, diff, focus)
        title=doc.title

        fcset = FlashcardSet.objects.create(
            document=doc,
            generated_by=request.user,
            num_cards=n,
            difficulty=diff,
            focus_topics=focus,
            cards=cards,
            title=title,
        )
        return Response(FlashcardSetSerializer(fcset).data, status=201)
class StudyEventViewSet(viewsets.ModelViewSet):
    serializer_class = StudyEventSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyEvent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotesViewSet(viewsets.ModelViewSet):  
    queryset = Notes.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Notes.objects.filter(user=self.request.user).order_by('-created_at')
