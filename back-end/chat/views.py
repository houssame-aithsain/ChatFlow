from rest_framework import viewsets, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
import sys
from django.core import validators
from .models import ChatSession, Message
from user.models import User
from urllib.parse import parse_qs

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
    
    def get_user_by_token(self, token):
        try:
            if token and token != "":
                user = User.objects.get(TOKEN=token)
                return user
            return None
        except User.DoesNotExist:
            return None
    
    @action(detail=False, methods=['get', 'post'], url_path='chatsession')
    def chatsession(self, request):
        print("----------------------------------------------------++++++++++++", flush=True)
        token = request.query_params.get("token")
        user = self.get_user_by_token(token)
        if user is not None:
            if request.method == 'POST':
                print("----------------------POST----------------------", flush=True)
                try:
                    session_id = request.data.get("id")
                    session = ChatSession.objects.get(id=session_id)
                    if session.user != user:
                        return Response({"error": "Session does not belong to user"}, status=status.HTTP_400_BAD_REQUEST)
                    serialized_session = ChatSessionSerializer(session)
                    print(f"----------------------{serialized_session.data}", flush=True)
                    return Response(serialized_session.data, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            try:
                print(f"----------------------{request.user}", flush=True)
                sessions = ChatSession.objects.filter(user=user)
                serialized_sessions = ChatSessionSerializer(sessions, many=True)
                return Response(serialized_sessions.data, status=status.HTTP_200_OK)
            except ChatSession.DoesNotExist:
                return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'], url_path='remove')
    def remove(self, request):
        token = request.query_params.get("token")
        user = self.get_user_by_token(token)
        if user is not None:
            try:
                session_id = request.data.get("id")
                session = ChatSession.objects.get(id=session_id)
                session.delete()
                print("Session removed", flush=True)
                return Response({"message": "Session removed", "id": session_id}, status=status.HTTP_200_OK)
            except ChatSession.DoesNotExist:
                return Response({"message": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='switch-model')
    def switch_model(self, request):
        token = request.query_params.get("token")
        user = self.get_user_by_token(token)
        if user is not None:
            try:
                user.ai_model_id = request.data.get("model_id")
                user.save()
                print(f"Model switched/////>>>>> {user.ai_model_id}", flush=True)
                return Response({"message": "Model switched"}, status=status.HTTP_200_OK)
            except ChatSession.DoesNotExist:
                return Response({"message": "Model not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
