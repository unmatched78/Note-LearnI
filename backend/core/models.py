from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import json
from django.utils import timezone
from shortuuidfield import ShortUUIDField
from django.conf import settings
# from cloudinary.models import CloudinaryField
from django.contrib.postgres.indexes import GinIndex
User= settings.AUTH_USER_MODEL

class CustomUser(AbstractUser):
    clerk_id = models.CharField(
        _("Clerk User ID"),
        max_length=255,
        unique=True,
        blank=True,
        null=True,
        help_text="The Clerk-issued user identifier"
    )
def validate_json(value):
    """
    Custom validator to ensure the value is a valid JSON string.
    """
    try:
        json.loads(value)
    except ValueError as e:
        raise ValidationError(
            _('Invalid JSON: %(error)s'),
            params={'error': str(e)},
        )

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
    notes=models.TextField(blank=True, null=True)
    file = models.ImageField(upload_to='documents/') #use cloudinary
    description = models.TextField(blank=True, null=True)
    code = models.CharField(max_length=50,null=True, unique=True, help_text="Unique code for the document")

    def __str__(self):
        return f"{self.title} by {self.user}"

class Quiz(Timer):
    """
    Model representing an AI-generated quiz for a given document.
    """
    quiz_title = models.CharField(
        max_length=200,
        help_text="Title of the quiz",
        null=True,
        blank=True,
        db_index=True,                   # simple btree index on quiz_title
    )
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True)
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE,help_text="User who triggered the quiz generation")
    questions = models.JSONField(help_text="Quiz questions in JSON format")

    class Meta:
        indexes = [
            GinIndex(
                name="quiz_questions_gin",
                fields=["questions"],
                opclasses=["jsonb_path_ops"]
            ),
        ]
        ordering = ['-created_at']
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
    

class Module(Timer):
    """
    Model representing a module containing multiple documents & other course material and quiz.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    documents = models.ManyToManyField(Document, related_name='modules', blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who created the module")
    quiz= models.ManyToManyField('Quiz', blank=True, related_name='modules', help_text="Quizs associated with this module")
    # Unique code for the module, can be used for easy reference
    code = models.CharField(max_length=50,null=True, unique=True, help_text="Unique code for the module")

    def __str__(self):
        return f"{self.title} by {self.created_by} and {self.code}"

#feature based model
class Summary(models.Model):
    """
    Stores a generated summary for a Document.
    """
    title=models.CharField(max_length=200, null=True, blank=True, db_index=True,help_text="Title of the summary")
    document = models.ForeignKey('Document', on_delete=models.CASCADE, related_name='summaries')
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    length = models.CharField(max_length=20)  # e.g. "short"/"medium"/"long"
    include_key_points = models.BooleanField(default=True)
    focus_areas = models.TextField(blank=True)
    snippet = models.CharField(
        max_length=100,
        editable=False,
        help_text="First 100 chars of the summary for quick search",
        db_index=True,
        null=True,
        blank=True
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
         indexes = [
            # index on the text content itself (trigram would be ideal, but this works):
             GinIndex(
                 name="summary_content_gin",
                 fields=["content"],
                 opclasses=["gin_trgm_ops"]
             ),
         ]

    def __str__(self):
         return f"Summary({self.length}) of {self.document.title}"

    def save(self, *args, **kwargs):
        # auto-populate the snippet field
        self.snippet = (self.content or "")[:100]
        super().save(*args, **kwargs)
class Transcript(Timer):
    """
    Stores a transcript (and optional summary) of uploaded media.
    """
    module = models.ManyToManyField('Module', blank=True, related_name='transcripts')
    media_url = models.URLField(null=True, blank=True, help_text="URL of the media file, thi swill be filled in case for a youtube video")
    audio_file=models.FileField(upload_to='transcripts/', null=True, blank=True)#use cloudinary field
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.CharField(max_length=30, default='english')
    speaker_identification = models.BooleanField(default=False)
    transcript = models.TextField()
    summary = models.TextField(blank=True, null=True)
    title=models.CharField(max_length=200,db_index=True, help_text="Title of the transcript set", null=True, blank=True)
    
    class Meta:
        indexes = [
            GinIndex(
                name="transcript_body_gin",
                fields=["transcript"],
                opclasses=["gin_trgm_ops"]
            ),
        ]
    def __str__(self):
        return f"Transcript of {self.generated_by.username}--{self.transcript[:80]}"


class FlashcardSet(Timer):
    """
    A set of AI‑generated flashcards for a Document.
    """
    title=models.CharField(max_length=200,db_index=True, help_text="Title of the flashcard set", null=True, blank=True)
    document = models.ForeignKey('Document', on_delete=models.CASCADE, related_name='flashcard_sets')
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    num_cards = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=20)
    focus_topics = models.TextField(blank=True)
    cards = models.JSONField()  # list of {"front": "...", "back": "..."}

    class Meta:
        indexes = [
            GinIndex(
                name="flashcards_cards_gin",
                fields=["cards"],
                opclasses=["jsonb_path_ops"]
            ),
        ]

    def __str__(self):
        return f"{self.num_cards} flashcards for {self.document.title}"
class StudyEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    datetime = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} @ {self.datetime}"
