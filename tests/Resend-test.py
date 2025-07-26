import os
import resend
from dotenv import load_dotenv

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

# Simple test
try:
    params = {
        "from": "onboarding@resend.dev",  # Use Resend's test domain
        "to": ["iradukundavierra4@gmail.com"],  # Use your actual email
        "subject": "Test Email",
        "html": "<p>Test message!</p>"
    }
    
    email = resend.Emails.send(params)
    print("Success! Email ID:", email.id)
    
except Exception as e:
    print("Error:", e)