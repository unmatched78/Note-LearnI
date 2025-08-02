# serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()
# users/serializers.py
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
        max_length=128
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password2']
    
    def validate_password(self, value):
        try:
            # Enforce Django's password validators
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match"})
        return attrs
    
    def create(self, validated_data):
        # Remove password2 before creating user
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Hashes the password
        user.save()
        return user

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
        """
        POST payload: {
          "module_id": int,
          "document_id": int,
          "created_by": int,
          "quiz": int,
            "code": str,
            "title": str,
            "description": str
        }
        """             
    def update(self, instance, validated_data):
        # Update the module instance with the provided data
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.code = validated_data.get('code', instance.code)
        instance.save()
        return instance
        """        POST payload: {
          "module_id": int,
          "document_id": int,
            "quiz": int,
          "created_by": int,
            "code": str,
            "title": str,
            "description": str
        }
        """     
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
        fields = ["id", "document", "generated_by", "length", "include_key_points",
                  "focus_areas", "content", "created_at"]
        read_only_fields = ["id", "generated_by", "content", "created_at"]

class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = [
            "id", "media_url", "generated_by", "language",
            "speaker_identification", "transcript", "summary", "created_at"
        ]
        read_only_fields = ["id", "generated_by", "transcript", "summary", "created_at"]


class FlashcardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashcardSet
        fields = ["id", "document", "generated_by", "num_cards",
                  "difficulty", "focus_topics", "cards", "created_at"]
        read_only_fields = ["id", "generated_by", "cards", "created_at"]
from .models import StudyEvent

class StudyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyEvent
        fields = ["id", "user", "title", "date", "time"]
        read_only_fields = ["id", "user"]