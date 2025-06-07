# serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import *
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

from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    # Only one password field; frontend can handle confirmation
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'email': {'required': True},
        }

    def create(self, validated_data):
        # Create user with provided password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
