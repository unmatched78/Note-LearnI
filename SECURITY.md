# Security Policy

## Supported Versions

We actively maintain the latest version of the project. Previous versions are not supported.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅                 |
| Others  | ❌                 |

---

## Reporting a Vulnerability

If you discover a security vulnerability, **please report it privately** via email:

📧 **iradukundavierra4@gmail.com**

Please include:

- A clear description of the issue
- Steps to reproduce (if possible)
- Any relevant logs, screenshots, or code snippets

We aim to respond to all reports within **72 hours**.

---

## Scope

This project includes:

- Django REST API (Python)
- React + TypeScript frontend
- Auth via Clerk.dev
- AI integrations (e.g., OpenAI, YouTube Transcript API)

Vulnerabilities related to third-party services (e.g., Clerk, OpenAI) should also be reported through their official channels.

---

## Security Best Practices We Follow

- ✅ HTTPS enforced for all requests  
- ✅ Rate-limiting + throttling for sensitive endpoints  
- ✅ CSRF protection on all non-API views  
- ✅ JWT-based authentication with refresh token support  
- ✅ Input validation and sanitization  
- ✅ Secure media file handling  
- ✅ File upload limits and extension checks  
- ✅ JSON field access constrained by backend (e.g., avoids `contains` on unsupported DBs)  
- ✅ Frontend: no direct DOM manipulation; strict React/TypeScript usage  
- ✅ Backend: DRF permission classes enforced (e.g., `IsAuthenticated`)  

---

## Areas of High Sensitivity

The following components require extra attention for security:

- Transcription endpoints (e.g., YouTube or audio uploads)
- AI prompt handling (avoid injection attacks)
- User-submitted documents and metadata
- Quiz and flashcard generation logic (ensure no prompt leaking)

---

## Dependencies

We regularly monitor and audit dependencies using:

- `pip-audit` (Python)
- `npm audit` or `pnpm audit` (JavaScript)

---

## Questions?

If you have general questions about the project's security approach, reach out on our GitHub Discussions or via the project maintainer email.

---

_This document is intended to promote transparency and collaboration. Let's keep education tools safe and accessible for all._
