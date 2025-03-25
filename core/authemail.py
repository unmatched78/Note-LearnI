# # utils.py  
# from django.core.mail import send_mail  
# from django.urls import reverse  
# from django.utils.http import urlsafe_base64_encode  
# from django.utils.encoding import force_bytes  
# #from .tokens import account_activation_token  
# from django.conf import settings
# def send_authentication_email(user, request):  
#     subject = 'Welcome, To Quickask'  
#     #uid = urlsafe_base64_encode(force_bytes(user.pk))  
#     #token = account_activation_token.make_token(user)  
#     #activation_link = reverse('activate', kwargs={'uidb64': uid, 'token': token})  # Correct usage of kwargs  
#     message = f'Hello {user.username},\n\nWelcome to Quickask family of learner. \n\nwhenever you have an question let as know where. \n\n\n Best regards, \n\nTeam.'  

#     send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
from django.core.mail import send_mail  
from django.core.mail import BadHeaderError  
from django.conf import settings  

def send_authentication_email(user, request):  
    subject = 'Welcome, To Quickask'  
    message = f'Hello {user.username},\n\nWelcome to Quickask family of learners. \n\nWhenever you have a question, let us know.\n\nBest regards,\n\nTeam.'  

    try:  
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])  
        print("Email sent successfully.")  # Optional: Log success or notify the user  
    except BadHeaderError:  
        print("Invalid header found.")  # Handle cases of invalid email addresses  
    except Exception as e:  
        print(f"An error occurred while sending email: {e}")  # Log or notify about other errors  