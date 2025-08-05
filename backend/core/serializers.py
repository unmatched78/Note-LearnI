# serializers.py
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
User = get_user_model()
# users/serializers.py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class AuthResponseSerializer(serializers.Serializer):
    tokens = serializers.DictField(child=serializers.CharField())
    user = UserSerializer()

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "user", "notes", "title", "file", "description", "created_at"]
        read_only_fields = ["id", "user", "description", "created_at"]

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "document", "generated_by", "quiz_title", "questions", "created_at"]
        read_only_fields = ["id", "generated_by", "questions", "created_at"]

class FailedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FailedQuestion
        fields = ["id", "question_data", "selected_answer"]

class QuizAttemptSerializer(serializers.ModelSerializer):
    failed_questions = FailedQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizAttempt
        fields = [
            "id", "quiz", "student", "responses", "score", 
            "total_questions", "created_at", "failed_questions"
        ]
        read_only_fields = ["id", "student", "score", "total_questions", "created_at", "failed_questions"]


class ModuleSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "quiz","description", "documents", "created_by", "code"]
        read_only_fields = ["id", "created_by", "documents"]

    def create(self, validated_data):
        # Create module with the user who created it
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
           
    def update(self, instance, validated_data):
        # Update the module instance with the provided data
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.code = validated_data.get('code', instance.code)
        instance.save()
        return instance
    def validate_code(self, value):
        """
        Ensure the code is unique and not already used by another module.
        """
        if Module.objects.filter(code=value).exists():
            raise serializers.ValidationError("This code is already in use by another module.")
        return value
    
    
#feature based serializers;
class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ["id", "document","title","snippet", "generated_by", "length", "include_key_points",
                  "focus_areas", "content", "created_at"]
        read_only_fields = ["id", "generated_by", "snippet", "content", "created_at"]


class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = [
            "id", "media_url", "generated_by", "language",
            "speaker_identification", "transcript", "summary", "title", "created_at"
        ]
        read_only_fields = ["id", "generated_by", "transcript", "summary", "created_at"]


class FlashcardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashcardSet
        fields = ["id", "document","title", "generated_by", "num_cards",
                  "difficulty", "focus_topics", "cards", "created_at"]
        read_only_fields = ["id", "generated_by", "cards", "created_at"]

class StudyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyEvent
        fields = ["id", "user", "title", "datetime"]
        read_only_fields = ["id", "user"]

class ResourceSerializer(serializers.Serializer):
    id            = serializers.IntegerField()
    resource_type = serializers.CharField()  # e.g. "quiz", "flashcard", "summary", "transcript", "document"
    title         = serializers.CharField()
    snippet       = serializers.CharField(allow_blank=True)
    created_at    = serializers.DateTimeField()
