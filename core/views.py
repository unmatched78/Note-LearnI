import json
import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.urls import reverse
from django.views import View
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from .authemail import send_authentication_email 
# Import our models
from .models import *
# Import our utility functions
from .utils.file_processing import extract_text_from_file, split_text_into_chunks
from .utils.quiz_utils import generate_questions_from_text, evaluate_answers_logic

logger = logging.getLogger(__name__)
MAX_FILE_SIZE_MB = 19
class PasswordResetConfirmView(View):  

    def get(self, request, uidb64, token):  
        try:  
            uid = force_str(urlsafe_base64_decode(uidb64))  
            user = User.objects.get(pk=uid)  
            if default_token_generator.check_token(user, token):  
                form = CustomPasswordResetForm()  
                return render(request, 'password_reset_confirm.html', {'form': form})  
            else:  
                messages.error(request, "Password reset link is invalid.")  
                return redirect('password_reset')  
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):  
            messages.error(request, "Password reset link is invalid.")  
            return redirect('password_reset')  

    def post(self, request, uidb64, token):  
        try:  
            uid = force_str(urlsafe_base64_decode(uidb64))  
            user = User.objects.get(pk=uid)  
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):  
            user = None  

        if user is not None and default_token_generator.check_token(user, token):  
            form = CustomPasswordResetForm(request.POST)  
            if form.is_valid():  
                user.set_password(form.cleaned_data['new_password1'])  # Use set_password to hash the password  
                user.save()  # Save the new password  
                messages.success(request, "Your password has been reset successfully.")  
                return redirect('login')  # Redirect to the login page  
            else:  
                messages.error(request, "Please correct the error above.")  # Notify errors  

            return render(request, 'password_reset_confirm.html', {'form': form})  

        else:  
            messages.error(request, "Password reset link is invalid.")  
            return redirect('password_reset') 
class PasswordResetView(View):  

    def get(self, request):  
        return render(request, 'password_reset.html')  

    def post(self, request):  
        email = request.POST.get('email')  

        # Check if the email exists in the database  
        try:  
            user = User.objects.get(email=email)  
        except User.DoesNotExist:  
            messages.error(request, "No account found with that email address.")  
            return redirect('password_reset')  # Redirect back to the password reset page  

        # Generate password reset token and encode user ID  
        token = default_token_generator.make_token(user)  
        uid = urlsafe_base64_encode(force_bytes(user.pk))  
        reset_link = request.build_absolute_uri(  
            reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})  
        )   
        subject = 'Password Reset Requested'  
    
        # Create a plaintext message  
        # message = (  
        #     f"Hello {user.get_full_name()},\n\n"  
        #     "You requested a password reset. Please use the link below to reset your password:\n\n"  
        #     f"{reset_link}\n\n"  
        #     "If you did not request this reset, please ignore this email.\n\n"  
        #     "Best regards,\n"  
        #     "Teacher Marking System Team"  
        # )  
        message = (  
        f"Hello {user.get_full_name()},\n\n"  
        "You requested a password reset. To reset your password, please follow the link below:\n\n"  
        f"========================= RESET YOUR PASSWORD =========================\n\n"  
        f"{reset_link}\n\n"  
        "======================================================================\n\n"  
        "Keep in mind that this is a one time link and will last for only 30 minutes.\n"
        "If you did not request this reset, please ignore this email.\n\n"  
        "Thank you,\n"  
        "Best regards,\n"  
        "Teacher Marking System Team"  
        )
        
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])  
    
        messages.success(request, "Password reset link sent. Please check your email.")   
        return redirect('password_reset')  # Optionally redirect back to a confirmation page
def signup(request):  
    if request.method == 'POST':  
        username = request.POST['username']  
        email = request.POST['email']  
        password = request.POST['password']  
        
        if User.objects.filter(username=username).exists():  
            messages.error(request, 'Username already exists.')  
            return redirect('signup')
        if User.objects.filter(email=email).exists():  
            messages.error(request, 'email already exists.')  
            return redirect('signup')  
        
        user = User(username=username, email=email)  
        user.set_password(password)  
        #user.is_active = False  # Deactivate account until it is confirmed  
        user.save()  
        send_authentication_email(user, request)  
        messages.success(request, 'Registration successful!')  
        return redirect('home')  
    
    return render(request, 'signup.html')
# ---------------------------
# Password Reset Views
# ---------------------------

# ---------------------------
# Authentication Views
# ---------------------------
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        usernamecheck=User.objects.filter(username=username).exists()
        if not usernamecheck:
            messages.error(request, 'Username does not exist! Please please enter a valid one!')
            return redirect('login')
        user = auth.authenticate(request, username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid credentials! Please check your password.')
            return redirect('login')
    return render(request, 'login.html')

def logout_view(request):
    auth.logout(request)
    return redirect('login')

# ---------------------------
# Home and Quiz-Related Views
# ---------------------------
@method_decorator(login_required(login_url="login"), name='dispatch')
class HomeView(View):
    def get(self, request):
        logger.debug("Home view accessed")
        return render(request, "home.html")
 

@method_decorator(login_required(login_url="login"), name='dispatch')  
class FileUploadView(View):  
    def post(self, request):  

        if request.POST.get('action') == 'upload_file' and 'file' in request.FILES:  
            uploaded_file = request.FILES['file']  
            file_size_mb = uploaded_file.size / (1024 * 1024)  
            
            if file_size_mb > MAX_FILE_SIZE_MB:  
                return JsonResponse({"error": f"File exceeds {MAX_FILE_SIZE_MB} MB limit."}, status=400)  
            
            text = extract_text_from_file(uploaded_file)  
            if not text:  
                return JsonResponse({"error": "Unsupported file or empty document."}, status=400)  

            text_chunks = split_text_into_chunks(text)  
            file_name = uploaded_file.name  # Get the name of the uploaded file   

            try:  
                # Join text_chunks to save it as a single string  
                description = "\n".join(text_chunks) if isinstance(text_chunks, list) else text_chunks  

                document, created = Document.objects.update_or_create(  
                    user=request.user,  
                    title=file_name,  
                    defaults={  
                        'description': description,  
                        'file': uploaded_file  
                    }  
                )  
                return JsonResponse({"text_chunks": text_chunks})  
            except Exception as e:  
                return JsonResponse({"error": str(e)}, status=500)  

        return JsonResponse({"error": "Invalid action or missing file."}, status=400)  


@method_decorator(login_required(login_url="login"), name='dispatch')
class QuizGenerationView(View):
    def post(self, request):
        try:
            text_chunks = json.loads(request.POST.get("text_chunks", "[]"))
        except Exception as e:
            logger.error("Error loading text_chunks JSON: %s", e)
            return JsonResponse({"error": "Invalid text_chunks format"}, status=400)
        prompt = request.POST.get("prompt", "")
        try:
            num_questions = int(request.POST.get("num_questions"))
        except Exception as e:
            logger.error("Error parsing num_questions: %s", e)
            #num_questions = 2
        # # Assuming you have a valid Document instance (for example, the most recently uploaded document)
        document_instance = Document.objects.filter(user=request.user).last()
        if not document_instance:
           return JsonResponse({"error": "No associated document found."}, status=400)

        questions = generate_questions_from_text(text_chunks, prompt, num_questions)
        if questions:
            quiz = Quiz.objects.create(
                generated_by=request.user,
                quiz_title="Generated Quiz",
                questions=questions,
                document=document_instance#None,  # Adjust if you later tie this to a Document
            )
            return JsonResponse({"questions": questions, "quiz_id": quiz.id})
        else:
            return JsonResponse({"error": "Failed to generate questions."}, status=500)

@method_decorator(login_required(login_url="login"), name='dispatch')
class QuizSubmitView(View):
    def post(self, request):
        try:
            quiz_id = int(request.POST.get("quiz_id"))
        except Exception as e:
            logger.error("Error parsing quiz_id: %s", e)
            return JsonResponse({"error": "Invalid quiz_id"}, status=400)
        try:
            student_answers = json.loads(request.POST.get("student_answers", "{}"))
        except Exception as e:
            logger.error("Error parsing student_answers JSON: %s", e)
            return JsonResponse({"error": "Invalid student_answers format"}, status=400)

        quiz = get_object_or_404(Quiz, id=quiz_id)
        questions = quiz.questions.get("questions", quiz.questions)
        feedback, total_correct, failed_questions = evaluate_answers_logic(questions, student_answers)

        quiz_attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user,
            responses=student_answers,
            score=total_correct,
            total_questions=len(questions),
        )

        for item in failed_questions:
            FailedQuestion.objects.create(
                quiz_attempt=quiz_attempt,
                question_data={
                    "question": item["question"],
                    "options": item["options"],
                    "correct_answer": item["correct_answer"],
                },
                selected_answer=item["student_answer"],
            )
        return JsonResponse({
            "feedback": feedback,
            "total_correct": total_correct,
            "total_questions": len(questions),
        })











































