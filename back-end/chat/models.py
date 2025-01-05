from django.db import models
from user.models import User

class ChatSession(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return f"Chat session for user {self.user.username} with session id {self.id}"


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ai_chatbot = models.CharField(max_length=255, default="AI Chatbot")
    user_message = models.TextField()
    ai_response = models.TextField()
    chat_session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="messages")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_ai_chat = models.BooleanField(default=True)

    def __str__(self):
        return f"Message from {self.user.username} to AI at {self.timestamp} |\n with message: {self.user_message} |\n and response: {self.ai_response}"
