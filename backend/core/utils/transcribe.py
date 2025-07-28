#core/utils/transcribe.py
import logging, os
from openai import OpenAI

logger = logging.getLogger(__name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def transcribe_media(file_url, language="english", speaker_identification=False, generate_summary=False):
    """
    Send an audio/video URL to OpenAI's audio endpoint (or Whisper)
    to get a transcript. Optionally also auto‑summarize.
    """
    client = OpenAI(api_key=OPENAI_API_KEY)
    try:
        # Use audio.transcriptions or Whisper endpoint
        transcript_resp = client.audio.transcriptions.create(
            file=file_url,
            model="whisper-1",
            response_format="text",
            language=language
        )
        transcript = transcript_resp.text

        if generate_summary:
            from .summarize import generate_summary
            return {
                "transcript": transcript,
                "summary": generate_summary([transcript], length="short")
            }

        return {"transcript": transcript}

    except Exception as e:
        logger.error("Transcription failed: %s", e)
        return {"transcript": ""}
