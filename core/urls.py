from django.urls import path
from .views import *

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', signup, name='signup'),
    path('logout/', logout_view, name='logout'),
    path('', HomeView.as_view(), name='home'),
    path('password_reset/', PasswordResetView.as_view(), name='password_reset'),  
    path('password_reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'), 
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('generate_quiz/', QuizGenerationView.as_view(), name='quiz_generation'),
    path('submit_quiz/', QuizSubmitView.as_view(), name='quiz_submission'),
]
