from rest_framework import viewsets, status, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import  Document, Quiz, QuizAttempt, FailedQuestion
from .serializers import (
     DocumentSerializer,
     QuizSerializer, QuizAttemptSerializer
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
