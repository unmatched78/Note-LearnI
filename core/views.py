from rest_framework import viewsets, status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from youtube_transcript_api import YouTubeTranscriptApi
from .models import Module, Document, Notes, YoutubeNote, Quiz, QuizAttempt, FailedQuestion
from .serializers import (
    ModuleSerializer, DocumentSerializer, NotesSerializer,
    YoutubeNoteSerializer, QuizSerializer, QuizAttemptSerializer
)
from .utils.file_processing import extract_text_from_file, split_text_into_chunks
from .utils.quiz_utils import generate_questions_from_text, evaluate_answers_logic, generate_summary
import logging
import os
import json
logger = logging.getLogger(__name__)

# JWT Login Endpoint
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {'id': self.user.id, 'username': self.user.username, 'email': self.user.email}
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MyTokenObtainPairSerializer

# Module CRUD
class ModuleViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Document Upload & CRUD
class DocumentViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        document = serializer.save(user=self.request.user)
        file = document.file
        text = extract_text_from_file(file)
        if text:
            chunks = split_text_into_chunks(text)
            document.chunks = chunks
            document.description = text  # Store full text for display
            document.save()
        return document

    @action(detail=True, methods=['get'])
    def chunks(self, request, pk=None):
        document = self.get_object()
        return Response(document.chunks)
# Notes CRUD
class NotesViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotesSerializer

    def get_queryset(self):
        return Notes.objects.filter(module__user=self.request.user)
class YoutubeNoteViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = YoutubeNoteSerializer

    def get_queryset(self):
        logger.debug("Fetching YoutubeNote queryset for user: %s", self.request.user)
        return YoutubeNote.objects.filter(module__user=self.request.user)

    @action(detail=True, methods=['get'])
    def transcript_chunks(self, request, pk=None):
        try:
            youtube_note = self.get_object()
            logger.debug("Fetching transcript chunks for youtube_note ID: %s", pk)
            text = youtube_note.transcription or ''
            chunks = split_text_into_chunks(text)
            logger.debug("Returning %d chunks", len(chunks))
            return Response(chunks)
        except YoutubeNote.DoesNotExist:
            logger.error("YoutubeNote with ID %s not found", pk)
            return Response({"error": "YouTube note not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error("Error in transcript_chunks: %s", e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def transcribe(self, request, pk=None):
        try:
            youtube_note = self.get_object()
            logger.debug("Transcribing youtube_note ID: %s, URL: %s", pk, youtube_note.youtubeVideoUrl)
            if not youtube_note.youtubeVideoUrl:
                return Response({"error": "No YouTube URL provided"}, status=status.HTTP_400_BAD_REQUEST)
            video_id = youtube_note.youtubeVideoUrl.split('v=')[1].split('&')[0]
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            text = ' '.join([t['text'] for t in transcript])
            youtube_note.transcription = text
            youtube_note.save()
            logger.debug("Transcription saved for youtube_note ID: %s", pk)
            return Response({"transcription": text})
        except YoutubeNote.DoesNotExist:
            logger.error("YoutubeNote with ID %s not found", pk)
            return Response({"error": "YouTube note not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error("Transcription error for youtube_note ID %s: %s", pk, e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def summarize(self, request, pk=None):
        try:
            youtube_note = self.get_object()
            logger.debug("Summarizing youtube_note ID: %s", pk)
            if not youtube_note.transcription:
                return Response({"error": "No transcription available"}, status=status.HTTP_400_BAD_REQUEST)
            summary = generate_summary(youtube_note.transcription)
            if summary is None:
                logger.error("Summary generation returned None for youtube_note ID %s", pk)
                return Response({"error": "Failed to generate summary"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            youtube_note.summary = summary
            youtube_note.save()
            logger.debug("Summary saved for youtube_note ID %s", pk)
            return Response({"summary": summary})
        except YoutubeNote.DoesNotExist:
            logger.error("YoutubeNote with ID %s not found", pk)
            return Response({"error": "YouTube note not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error("Summarization error for youtube_note ID %s: %s", pk, e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
# ... other imports and views ...

class QuizViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuizSerializer

    def get_queryset(self):
        return Quiz.objects.filter(generated_by=self.request.user)
class QuizGenerationAPIView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuizSerializer

    def create(self, request, *args, **kwargs):
        logger.debug("Received quiz generation request: %s", request.data)
        document_id = request.data.get('document_id')
        document = get_object_or_404(Document, id=document_id, user=request.user)
        text_chunks = document.chunks
        prompt = request.data.get('prompt', '')
        num_questions = int(request.data.get('num_questions', 5))
        questions = generate_questions_from_text(text_chunks, prompt, num_questions)
        # Ensure questions is an array
        if isinstance(questions, dict) and 'questions' in questions:
            questions = questions['questions']
        logger.debug("Generated questions: %s", questions)
        quiz = Quiz.objects.create(
            generated_by=request.user,
            quiz_title=request.data.get('quiz_title', 'Generated Quiz'),
            questions=questions,  # Save the array directly
            document=document
        )
        serializer = self.get_serializer(quiz)
        logger.debug("Quiz created: %s", serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
# # Quiz Generation API
# class QuizGenerationAPIView(generics.CreateAPIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = QuizSerializer

#     def create(self, request, *args, **kwargs):
#         logger.debug("Received quiz generation request: %s", request.data)
#         document_id = request.data.get('document_id')
#         document = get_object_or_404(Document, id=document_id, user=request.user)
#         text_chunks = document.chunks
#         prompt = request.data.get('prompt', '')
#         num_questions = int(request.data.get('num_questions', 5))
#         questions = generate_questions_from_text(text_chunks, prompt, num_questions)
#         logger.debug("Generated questions: %s", questions)
#         quiz = Quiz.objects.create(
#             generated_by=request.user,
#             quiz_title=request.data.get('quiz_title', 'Generated Quiz'),
#             questions=questions,
#             document=document
#         )
#         serializer = self.get_serializer(quiz)
#         logger.debug("Quiz created: %s", serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

# Quiz Submission API
class QuizSubmitAPIView(generics.GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuizAttemptSerializer

    def post(self, request, *args, **kwargs):
        quiz = get_object_or_404(Quiz, id=request.data.get('quiz'))
        answers = request.data.get('responses', {})
        feedback, total_correct, failed = evaluate_answers_logic(quiz.questions, answers)

        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user,
            responses=answers,
            score=total_correct,
            total_questions=len(quiz.questions)
        )
        for item in failed:
            FailedQuestion.objects.create(
                quiz_attempt=attempt,
                question_data=item,
                selected_answer=item.get('student_answer')
            )

        serializer = self.get_serializer(attempt)
        return Response({**serializer.data, 'feedback': feedback}, status=status.HTTP_201_CREATED)

# Chat API
class ChatAPIView(generics.GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        prompt = request.data.get('prompt')
        context = request.data.get('context', [])
        if not prompt:
            return Response({"error": "No prompt provided"}, status=400)
        full_prompt = "Context:\n" + "\n".join(context) + "\n\nQuestion: " + prompt
        try:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": full_prompt},
                ]
            )
            reply = response.choices[0].message.content
            return Response({"reply": reply})
        except Exception as e:
            logger.error("Chat error: %s", e)
            return Response({"error": str(e)}, status=400)