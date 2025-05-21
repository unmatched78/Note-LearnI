from rest_framework import serializers
from .models import (
    Module, Document, Notes, YoutubeNote,
    Quiz, QuizAttempt, FailedQuestion
)

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'module', 'title', 'file', 'description','chunks', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ['id', 'module', 'document', 'notes', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'name', 'created_at', 'updated_at']

class YoutubeNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = YoutubeNote
        fields = ['id', 'module', 'document', 'summary', 'transcription', 'youtubeVideoUrl', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'name', 'created_at', 'updated_at']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'document', 'quiz_title', 'questions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'responses', 'score', 'total_questions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'score', 'total_questions', 'created_at', 'updated_at']

class FailedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FailedQuestion
        fields = ['id', 'quiz_attempt', 'question_data', 'selected_answer', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
class ModuleSerializer(serializers.ModelSerializer):
    documents      = DocumentSerializer(many=True, read_only=True)
    notes          = NotesSerializer(many=True, read_only=True)
    youtube_notes  = YoutubeNoteSerializer(many=True, read_only=True)
    quizzes        = QuizSerializer(many=True, read_only=True, source='quiz_set')

    class Meta:
        model = Module
        fields = ['id','name','description','documents','notes','youtube_notes','quizzes']