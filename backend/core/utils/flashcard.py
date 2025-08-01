# core/utils/flashcard.py
import logging
import os
from openai import OpenAI
import json
logger = logging.getLogger(__name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def generate_flashcards(text_chunks, num_cards=10, difficulty="medium", focus_topics=""):
    """
    Generate simple Q&A flashcards from text chunks.
    Returns a list of {"front": "...", "back": "..."} dicts.
    """
    client = OpenAI(api_key=OPENAI_API_KEY)

    prompt = (
        f"Create {num_cards} flashcards at {difficulty} difficulty"
        + (f" focusing on {focus_topics}." if focus_topics else ".")
        + "\n\nContent:\n" + "\n".join(text_chunks)
        + "\n\nFormat exactly as JSON:\n"
        + '[{"front":"Question text","back":"Answer text"}, …]'
    )

    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You generate study flashcards."},
                {"role": "user", "content": prompt},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "flashcard_schema",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "flashcard": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "front": {"type": "string"},
                                        "back": {"type": "string"}
                                    },
                                    "required": ["front", "back"],
                                    "additionalProperties": False
                                }
                            }
                        }
                    }
                }
            }
        )

        # .message.content is the raw JSON string
        raw_json = resp.choices[0].message.content
        # Parse it into a dict
        payload = json.loads(raw_json)
        cards = payload.get("flashcard", [])
        if not isinstance(cards, list):
            logger.error("Unexpected flashcard format: %r", payload)
            return []
        return cards

    except Exception as e:
        logger.error("Flashcard generation failed: %s", e)
        return []