from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from youtube_transcript_api.formatters import TextFormatter
import logging

logger = logging.getLogger(__name__)

def extract_video_id(youtube_url: str) -> str:
    """
    Extracts the video ID from a standard YouTube URL.
    """
    import re
    match = re.search(r"(?:v=|youtu\.be/|embed/)([A-Za-z0-9_-]{11})", youtube_url)
    if not match:
        raise ValueError("Invalid YouTube URL format.")
    return match.group(1)


def transcribe_youtube_video(url: str, language="en", generate_summary=False):
    try:
        video_id = extract_video_id(url)
        # Fetch the transcript directly
        transcript_list = YouTubeTranscriptApi().list(video_id)
        transcript = transcript_list.find_transcript([language])
        data = transcript.fetch()
        text = TextFormatter().format_transcript(data)

        if generate_summary:
            from .summarize import generate_summary
            return {
                "transcript": text,
                "summary": generate_summary([text], length="short")
            }

        return {"transcript": text}

    except TranscriptsDisabled:
        logger.error("Transcripts are disabled for this video.")
        return {"transcript": "Transcripts are disabled for this video."}
    except NoTranscriptFound:
        logger.error("No transcript found for this video.")
        return {"transcript": "No transcript found for this video."}
    except ValueError as ve:
        logger.error(f"Invalid YouTube URL: {ve}")
        # propagate to view for proper 400
        raise
    except Exception as e:
        logger.error(f"Failed to fetch YouTube transcript: {e}")
        return {"transcript": ""}
