from django.db import models
from user.models import User

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # The user interacting with the AI
    ai_chatbot = models.CharField(max_length=255, default="AI Chatbot")  # The AI chatbot (you can customize this)
    user_message = models.TextField()  # The message from the user
    ai_response = models.TextField()  # The response from the AI
    timestamp = models.DateTimeField(auto_now_add=True)  # Time when the message was created
    is_ai_chat = models.BooleanField(default=True)  # Whether it's part of the AI communication

    def __str__(self):
        return f"Message from {self.user.username} to AI at {self.timestamp}"
