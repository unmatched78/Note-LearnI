# # core/authentication.py
# from django.contrib.auth import get_user_model
# from rest_framework.authentication import BaseAuthentication
# from rest_framework.exceptions import AuthenticationFailed


# User = get_user_model()

# class ClerkAuthentication(BaseAuthentication):
#     def authenticate(self, request):
#         #Clerk SDK call #
#         if not state.is_signed_in:
#             raise AuthenticationFailed("Invalid token")

#         clerk_id = state.payload.get("sub")
#         if not clerk_id:
#             raise AuthenticationFailed("Malformed token")

#         # Lookup or create Django user:
#         user, created = User.objects.get_or_create(
#             clerk_id=clerk_id,
#             defaults={
#                 "username": f"clerk_{clerk_id}",
#                 # also you cn populate email, first_name iii:
#                  "email": state.payload.get("email"),
#             }
#         )

#         # Return the Django user object
#         return (user, token)
# core/auth/authentication.py
# core/auth/authentication.py
import os
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from clerk_backend_api import Clerk, AuthenticateRequestOptions

User = get_user_model()

# Initialize Clerk SDK with your secret key
clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY") or settings.CLERK_SECRET_KEY)

class ClerkAuthentication(authentication.BaseAuthentication):
    """
    DRF authentication class to verify Clerk JWT: upsert or lookup a local User by clerk_id.
    """
    def authenticate(self, request):
        # Verify the incoming request JWT
        try:
            request_state = clerk_sdk.authenticate_request(
                request,
                AuthenticateRequestOptions(
                    authorized_parties=[os.getenv("CLERK_FRONTEND_ORIGIN", "http://localhost:5173")],
                    jwt_key=os.getenv("JWT_KEY") or settings.CLERK_JWT_KEY,
                )
            )
        except Exception as exc:
            import logging
            logging.error(f"Clerk authentication error: {exc}")
            raise exceptions.AuthenticationFailed("Authentication failed due to an internal error.")

        # Ensure user is signed in
        if not request_state.is_signed_in:
            raise exceptions.AuthenticationFailed("Invalid or missing token")

        # Extract Clerk user ID and optional email
        clerk_id = request_state.payload.get("sub")
        if not clerk_id:
            raise exceptions.AuthenticationFailed("Token missing 'sub' claim")

        email = request_state.payload.get("email")

        # Lookup or create a Django user with this clerk_id
        user, created = User.objects.get_or_create(
            clerk_id=clerk_id,
            defaults={
                "username": f"clerk_{clerk_id[-6:]}",
                "email": email,
            }
        )

        # Optionally update email if changed
        if not created and email and user.email != email:
            user.email = email
            user.save(update_fields=["email"])

        # Return the Django User and None for token
        return (user, None)

    def authenticate_header(self, request):
        return 'Bearer'
