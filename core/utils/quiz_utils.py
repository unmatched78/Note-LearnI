import json
import logging
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
logger = logging.getLogger(__name__)
# Set your OpenAI API key (you may want to move this to your settings)

openai_api_key = os.getenv('OPENAI_API_KEY')

def generate_questions_from_text(text_chunks, prompt, num_questions):
    """
    Generate multiple-choice questions from text chunks using OpenAI.
    """
    combined_text = "\n".join(text_chunks)
    combined_prompt = (
        f"{prompt}\nContent:\n{combined_text}\n\n"
        f"Generate exactly {num_questions} multiple-choice questions with correct answers in JSON format:\n"
        '[{"question": "string", "options": ["A", "B", "C", "D""....], "correct_choice": "string"}]'
    )
    try:
        client = OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-4o",  # Replace with your actual model name
            messages=[
                {"role": "system", "content": "Generate challenging questions in JSON format."},
                {"role": "user", "content": combined_prompt},
            ],
            response_format = {
    "type": "json_schema",
    "json_schema": {
       "name": "student_schema",
       "schema": {
                "type": "object",
        "properties": {
            "questions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string"},
                        "options": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 2  # Ensures at least two options
                        },
                        "correct_choice": {"type": "string"}
                    },
                    "required": ["question", "options", "correct_choice"],
                    "additionalProperties": False
                }
            }
        }
       }
    }
}
        )
        content = response.choices[0].message.content
        print(f"=*30\n{content}\n=*30")
        questions = json.loads(content)
        return questions
    except Exception as e:
        logger.error("Error generating questions: %s", e)
    return []


def evaluate_answers_logic(questions, student_answers):
    """
    Evaluate student answers against generated quiz questions.
    Returns detailed feedback, the total number of correct answers,
    and a list of failed questions.
    """
    feedback = []
    total_correct = 0
    failed_questions = []
    for i, question in enumerate(questions):
        correct_answer_text = question.get("correct_choice", "").strip()
        student_answer = student_answers.get(f"Q{i+1}", "").strip()
        # Directly compare the student's answer text with the correct answer text (case-insensitive)
        is_correct = student_answer.lower() == correct_answer_text.lower()
        feedback_item = {
            "question": question["question"],
            "options": question.get("options", []),
            "correct_answer": correct_answer_text,
            "student_answer": student_answer,
            "is_correct": is_correct,
        }
        feedback.append(feedback_item)
        if not is_correct:
            failed_questions.append(feedback_item)
        else:
            total_correct += 1
    return feedback, total_correct, failed_questions
