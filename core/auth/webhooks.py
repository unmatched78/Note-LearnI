# core/auth/webhooks.py
import os
import json
import logging
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
    HttpResponseServerError
)
from svix.webhooks import Webhook
from django.contrib.auth import get_user_model
from .authemail import send_authentication_email
from dotenv import load_dotenv
logger = logging.getLogger(__name__)
User = get_user_model()
load_dotenv()

@csrf_exempt
def clerk_webhook(request):
    """
    Handles Clerk 'user.created' webhook events, verifies via Svix,
    and upserts a local Django User with clerk_id.
    """
    # Only allow POST
    if request.method != "POST":
        logger.warning("Clerk webhook: invalid method %s", request.method)
        return HttpResponseBadRequest("Only POST allowed")

    raw_body = request.body
    headers = {k.lower(): v for k, v in request.headers.items()}

    # Verify signature
    secret = os.getenv("CLERK_WEBHOOK_SECRET") #or getattr(settings, "CLERK_WEBHOOK_SECRET", None)
    if not secret:
        logger.error("Clerk webhook secret not configured")
        return HttpResponseServerError("Webhook secret not set")

    try:
        wh = Webhook(secret)
        wh.verify(raw_body.decode("utf-8"), headers)
    except Exception as exc:
        logger.warning("Invalid Clerk webhook signature: %s", exc)
        return HttpResponseForbidden("Invalid signature")

    # Parse JSON
    try:
        payload = json.loads(raw_body)
    except json.JSONDecodeError:
        logger.error("Malformed JSON payload in Clerk webhook")
        return HttpResponseBadRequest("Malformed JSON")

    event_type = payload.get("type")
    data = payload.get("data", {})

    if event_type == "user.created":
        try:
            clerk_id = data.get("id")
            emails = data.get("email_addresses", [])
            primary_email = (
                next((e.get("email_address") for e in emails if e.get("primary")), None)
                or emails[0].get("email_address", None) if emails else None
            )
            first_name = data.get("first_name", "") or ""
            last_name = data.get("last_name", "") or ""
            username = data.get("username") or f"clerk_{clerk_id[-6:]}"

            user, created = User.objects.get_or_create(
                clerk_id=clerk_id,
                defaults={
                    "username": username,
                    "email": primary_email,
                    "first_name": first_name,
                    "last_name": last_name,
                }
            )

            if created:
                logger.info("Created Django user for Clerk ID %s", clerk_id)
                # Send welcome/auth emails
                send_authentication_email(user, request)
                # send_welcome_email(user.email)
            else:
                logger.debug("User already exists for Clerk ID %s", clerk_id)

            return HttpResponse(status=200)

        except Exception as exc:
            logger.exception("Error handling user.created webhook: %s", exc)
            return HttpResponseServerError("An internal error has occurred.")

    # Ignore other event types
    logger.debug("Ignoring Clerk event type: %s", event_type)
    return HttpResponse(status=202)
