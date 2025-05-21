# core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import*
router = DefaultRouter()
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'notes', NotesViewSet, basename='notes')
router.register(r'youtube-notes', YoutubeNoteViewSet, basename='youtube-note')
router.register(r'quiz', QuizViewSet,  basename='quiz')  # Added
urlpatterns = [
    path('api/quiz/generate/', QuizGenerationAPIView.as_view(), name='quiz-generate'),
    path('api/quiz/submit/',   QuizSubmitAPIView.as_view(),  name='quiz-submit'),
    path('api/chat/', ChatAPIView.as_view(), name='chat'),
# Explicit YouTube note actions
    path('api/youtube-notes/<int:pk>/transcribe/', YoutubeNoteViewSet.as_view({'post': 'transcribe'}), name='youtube-note-transcribe'),
    path('api/youtube-notes/<int:pk>/transcript-chunks/', YoutubeNoteViewSet.as_view({'get': 'transcript_chunks'}), name='youtube-note-transcript-chunks'),
    path('api/youtube-notes/<int:pk>/summarize/', YoutubeNoteViewSet.as_view({'post': 'summarize'}), name='youtube-note-summarize'),
    # Other endpoints
    path('api/', include(router.urls)),
    #path('', include(router.urls)),
    # JWT:
    path('api/auth/token/login/',   MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),
]
