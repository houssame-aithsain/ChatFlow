from rest_framework import viewsets, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
import sys
from django.core import validators
from .models import ChatSession, Message

# Create your views here.
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    class Meta:
        model = ChatSession
        fields = '__all__'

class SessionsManager(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    
    action(detail=False, methods=['get'], url_path='chat_session')
    def get_user_session(self, request):
        print("----------------------------------------------------++++++++++++", flush=True)
        cookie = request.COOKIES.get('user')
        if not cookie:
            return Response({"message": "access denied"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            print(f"-----------------------*cookie: {cookie}", flush=True)
            print(f"-----------------------*request.user: {request.user}", flush=True)
            session = ChatSession.objects.get(user=request.user)
            Response(ChatSessionSerializer(session).data, status=status.HTTP_200_OK)
        except ChatSession.DoesNotExist:
            return Response({"message": "session not found"}, status=status.HTTP_404_NOT_FOUND)

