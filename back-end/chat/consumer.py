import jwt
import json
from django.shortcuts import get_object_or_404
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message, ChatSession
from datetime import datetime
from user.models import User
from urllib.parse import parse_qs
import google.generativeai as genai
from groq import Groq

#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

class ChatConsumer(WebsocketConsumer):
    Gmessages = {"users": []}

    def connect(self):
        query_string = self.scope.get("query_string", b"")
        query_params = parse_qs(query_string.decode("utf-8"))
        user_token = query_params.get("token", [None])[0]
        if user_token:
            try:
                print(f"Token found in cookies: {user_token}", flush=True)
                self.user = User.objects.get(TOKEN=user_token)
                self.ChatSession = self.create_new_chat_session()
                print(f"Connected-------------->{self.user}", flush=True)
                user_section = {
                    "user_id": self.user.id,
                    "history": [
                        {
                            "role": "system",
                            "content": "you are a helpful assistant.",
                        }
                    ],
                }
                if not any(u["user_id"] == self.user.id for u in self.Gmessages["users"]):
                    self.Gmessages["users"].append(user_section)
                self.accept()
            except User.DoesNotExist:
                print("User not found", flush=True)
                return None
        else:
            print("No token found in cookies", flush=True)
            return None

    def disconnect(self, close_code):
        print("Disconnected", flush=True)
        self.close()

    def receive(self, text_data):
        print("-+-+-+-+-+-+-+-+>Received message", flush=True)
        text_data_json = json.loads(text_data)
        user_message = text_data_json["message"]

        # if not self.user.is_authenticated:
        #     return 
        # Generate the AI response (replace this with your AI logic)
        ai_response = self.get_ai_response(user_message)
        response = self.add_message_to_session(self.ChatSession.id, self.user, user_message, ai_response)

        print(f"Message created: {response}", flush=True)
        self.send_message(response)

    def create_new_chat_session(self):
        """Create a new chat session."""
        chat_session = ChatSession.objects.create(user=self.user)
        return chat_session

    def add_message_to_session(self, chat_session_id, user, user_message, ai_response):
        """Add a new message to an existing chat session."""
        try:
            chat_session = ChatSession.objects.get(id=chat_session_id)  # Fetch the chat session
        except ChatSession.DoesNotExist:
            raise ValueError("Chat session not found.")

        # Create the message linked to the chat session
        message = Message.objects.create(
            user=user,
            ai_chatbot="AI Chatbot",
            user_message=user_message,
            ai_response=ai_response,
            chat_session=chat_session,
        )
        message.save()
        return message

    def get_ai_response(self, user_message):
        client = Groq(

            api_key="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"

        )
        user_section = next(
            (u for u in self.Gmessages["users"] if u["user_id"] == self.user.id), None
        )

        if not user_section:
            raise ValueError(f"No user session found for user ID {self.user.id}")

        user_section["history"].append({"role": "user", "content": user_message})
        
        chat_completion = client.chat.completions.create(
            messages=user_section["history"],
            model="llama-3.1-8b-instant",
            max_tokens=1024,
            top_p=1,
            stop=None,
            stream=False,
        )

        user_section["history"].append({"role": "system", "content": chat_completion.choices[0].message.content})
        return chat_completion.choices[0].message.content

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
