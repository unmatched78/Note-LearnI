# core/utils/summarize.py
import logging, os
import json
from openai import OpenAI

logger = logging.getLogger(__name__)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generate_summary(text_chunks, length="medium", include_key_points=True, focus_areas=""):
    """
    Use OpenAI to generate a Markdown-rich summary.
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

    system_message = """
You are a helpful assistant that writes well-structured, fully-formatted Markdown summaries.
Your output MUST include:

1. A top-level heading for the document title.
2. Clear section headers (`##`, `###`) to break out major topics.
3. Bullet or numbered lists for key points.
4. Tables when comparing data (use Markdown table syntax).
5. Code fences for any quoted or example text.
6. Blockquotes for any notable quotes.
7. **Bold** and _italic_ styling where helpful.
8. Proper indentation for nested lists or subpoints.

Example structure:

```

# Document Title

## Section 1: Overview

* **Key point A**: description

  * Subpoint i
  * Subpoint ii

## Section 2: Details

| Metric     | Value |
| ---------- | ----- |
| Metric One | 123   |
| Metric Two | 456   |

> “This is an important quote from the text.”

```python
# Example code block if needed
print("Hello, world!")
```

## Conclusion

* Summary bullet 1
* Summary bullet 2

```
All your responses should follow the pattern above, adapting headers, lists, tables, quotes, and code blocks to the content.  since we are using json schema to validate the response; please ensure that the response is in the format specified in the json schema.
    """.strip()

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt},
            ],
            response_format = {
    "type": "json_schema",
    "json_schema": {
       "name": "summary_schema",
       "schema": {
                "type": "object",
        "properties": {
            "summary": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "summary": {"type": "string"},
                    },
                    "required": ["title", "summary"],
                    "additionalProperties": False
                }
            }
        }
       }
    }
}
        )
        #return resp.choices[0].message.content.strip()
        content = response.choices[0].message.content
        print(f"=*30\n{content}\n=*30")
        summary = json.loads(content)
        return summary
    except Exception as e:
            logger.error("Error generating summary: %s", e)
    return []