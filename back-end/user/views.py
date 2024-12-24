from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User
from rest_framework import status
import sys
from django.core import validators

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        data = request.data
        try:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                password=data['password'],
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except validators.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except:
            e = sys.exc_info()[0]
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        user.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        data = request.data
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
        if user.check_password(data['password']):
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)
