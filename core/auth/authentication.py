# core/authentication.py
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()

class ClerkAuthentication(BaseAuthentication):
    def authenticate(self, request):
        #Clerk SDK call #
        if not state.is_signed_in:
            raise AuthenticationFailed("Invalid token")

        clerk_id = state.payload.get("sub")
        if not clerk_id:
            raise AuthenticationFailed("Malformed token")

        # Lookup or create Django user:
        user, created = User.objects.get_or_create(
            clerk_id=clerk_id,
            defaults={
                "username": f"clerk_{clerk_id}",
                # also you cn populate email, first_name iii:
                 "email": state.payload.get("email"),
            }
        )

        # Return the Django user object
        return (user, token)
