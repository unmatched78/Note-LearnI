#core/utis/summarize.py
import logging, os
from openai import OpenAI

logger = logging.getLogger(__name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generate_summary(text_chunks, length="medium", include_key_points=True, focus_areas=""):
    """
    Use OpenAI to generate a text summary.
    Returns the plain string summary.
    """
    client = OpenAI(api_key=OPENAI_API_KEY)
    prompt = (
        f"Summarize the following content into a {length} summary"
        + (" including key points." if include_key_points else ".")
    )
    if focus_areas:
        prompt += f" Focus especially on: {focus_areas}."
    prompt += "\n\nContent:\n" + "\n".join(text_chunks)

    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that writes concise summaries."},
                {"role": "user", "content": prompt},
            ],
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        logger.error("Summarization failed: %s", e)
        return ""
