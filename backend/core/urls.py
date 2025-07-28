# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth.webhooks import clerk_webhook

from .views import (
    DocumentViewSet,
    QuizViewSet,
    QuizAttemptViewSet,
    UserViewSet,
    ModuleViewSet,
    SummaryViewSet,
    TranscriptViewSet,
    FlashcardViewSet
)

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'quizzes',   QuizViewSet,     basename='quiz')
router.register(r'attempts',  QuizAttemptViewSet, basename='attempt')
router.register(r'users',     UserViewSet,     basename='user')
router.register(r'modules',   ModuleViewSet,   basename='module')
router.register(r'summaries', SummaryViewSet, basename='summary')
router.register(r'transcripts', TranscriptViewSet, basename='transcript')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')


urlpatterns = [
    # 1) Public /auth endpoints FIRST
    path("api/webhooks/clerk/", clerk_webhook, name="clerk_webhook"),

    # 2) Then everything else under /api/
    path('api/', include(router.urls)),
]
