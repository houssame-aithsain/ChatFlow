import jwt
import json
from django.shortcuts import get_object_or_404
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message
from datetime import datetime
from user.models import User
from urllib.parse import parse_qs

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        query_string = self.scope.get("query_string", b"")
        query_params = parse_qs(query_string.decode("utf-8"))
        user_token = query_params.get("token", [None])[0]
        if user_token:
            try:
                print(f"Token found in cookies: {user_token}", flush=True)
                self.user = User.objects.get(TOKEN=user_token)
                print(f"Connected-------------->{self.user}", flush=True)
                self.accept()
                return self.user
            except User.DoesNotExist:
                print("User not found", flush=True)
                return None
        else:
            print("No token found in cookies", flush=True)
            return None

    def disconnect(self, close_code):
        self.close()

    def receive(self, text_data):
        print("-+-+-+-+-+-+-+-+>Received message", flush=True)
        text_data_json = json.loads(text_data)
        user_message = text_data_json["message"]

        if not self.user.is_authenticated:
            return 

        msg = Message.objects.create(
            user=self.user,
            ai_chatbot="AI Chatbot",
            user_message=user_message,
            ai_response="hello from the backend :)",
        )
        print(f"Message created: {msg}", flush=True)
        # Generate the AI response (replace this with your AI logic)
        ai_response = self.get_ai_response(user_message)

        msg.ai_response = ai_response
        msg.save()

        self.send_message(msg)

    def get_ai_response(self, user_message):
        return f"AI response to: {user_message}"

    def send_message(self, msg):
        self.send(
            text_data=json.dumps(
                {
                    "message": msg.user_message,
                    "ai_response": msg.ai_response,
                    "timestamp": msg.timestamp.isoformat(),
                }
            )
        )
