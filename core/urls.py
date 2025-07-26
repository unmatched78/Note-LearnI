# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    MyTokenObtainPairView,
    DocumentViewSet,
    QuizViewSet,
    QuizAttemptViewSet,
    UserViewSet,
    MyTokenRefreshView,
    ModuleViewSet,
)

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'quizzes',   QuizViewSet,     basename='quiz')
router.register(r'attempts',  QuizAttemptViewSet, basename='attempt')
router.register(r'users',     UserViewSet,     basename='user')
router.register(r'modules',   ModuleViewSet,   basename='module')


urlpatterns = [
    # 1) Public /auth endpoints FIRST
    path('api/auth/register/',       RegisterView.as_view(),       name='auth_register'),
    path('api/auth/token/login/',    MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/',  TokenRefreshView.as_view(),      name='token_refresh'),

    # 2) Then everything else under /api/
    path('api/', include(router.urls)),
]
