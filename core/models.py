from django.db import models
from django.contrib.auth.models import User

class Timer(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']

class Document(Timer):
    """
    Model for uploaded study materials (PDF, Word, etc.).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.user}"

class Quiz(Timer):
    """
    Model representing an AI-generated quiz for a given document.
    """
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True)
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who triggered the quiz generation")
    quiz_title = models.CharField(max_length=200)
    # Structure example: [{'question': 'What is ...?', 'choices': ['A', 'B', 'C'], 'correct': 'B'}, ...]
    questions = models.JSONField(help_text="Quiz questions and choices in JSON format")

    def __str__(self):
        return f"{self.quiz_title} for {self.document.title}"

class QuizAttempt(Timer):
    """
    Model to store a student's attempt at a quiz.
    """
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    # User responses in JSON format; structure can be defined as needed.
    responses = models.JSONField(help_text="User responses for each question in JSON format")
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField()

    def __str__(self):
        return f"{self.student} - {self.quiz.created_at}"

class FailedQuestion(Timer):
    """
    Model to record questions a student answered incorrectly.
    """
    quiz_attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='failed_questions')
    # Save the original question details (question text, choices, correct answer, etc.)
    question_data = models.JSONField(help_text="Details of the failed question in JSON format")
    # Record the answer the student selected
    selected_answer = models.JSONField(help_text="The student's incorrect answer in JSON format")

    def __str__(self):
        return f"{self.quiz_attempt.student} failed question in {self.quiz_attempt.quiz.quiz_title}"
