# serializers.py
from rest_framework import serializers
from .models import Document, Quiz, QuizAttempt, FailedQuestion

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "user", "title", "file", "description", "created_at"]
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
from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    # Single password field; frontend handles confirmation if desired
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'email': {'required': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
