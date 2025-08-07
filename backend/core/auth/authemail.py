# core/auth/authemail.py
import os
import resend
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Resend API key and sender email
resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("RESEND_SENDER_EMAIL") 
#print(resend.api_key)

def send_authentication_email(user, request):
    """
    Send a welcome email to a new user via Resend.
    """
    try:
        # Build email parameters
        params: resend.Emails.SendParams = {
            "from": FROM_EMAIL,
            "to": [user.email],
            "subject": "Welcome to Quickask!",
            "html": f"""
                <p>Hello {user.username},</p>
                <p>Welcome to the Quickask family of learners!</p>
                <p>Whenever you have a question, let us know.</p>
                <p>Best regards,<br/>Team Quickask</p>
            """
        }

        # Send email through Resend
        email: resend.Email = resend.Emails.send(params)
        print("Resend email sent, id:", email.id)
    except Exception as e:
        # Log detailed error
        print("Error sending via Resend:", repr(e))


def send_welcome_email(user, request):
    """for sending authentication email"""
    send_authentication_email(user, request)
