from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
import sys
from django.core import validators
from django.contrib.auth import login, logout
from .models import User
from django.contrib.auth import login, logout
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken

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
            if user.check_password(data['password']):
                if user is not None:
                    # Create JWT token
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)

                    # Log the user in
                    login(request, user)

                    # Serialize user data
                    user_data = UserSerializer(user).data

                    # Return the response with the token and user data
                    response = Response({
                        'user': user_data,
                        'token': access_token
                    }, status=status.HTTP_200_OK)

                    # Set the session cookie (optional, for session-based login)
                    response.set_cookie('user', user.get_session_auth_hash(), httponly=True, secure=True)

                    return response
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)


    @action(detail=False, methods=['get'], url_path='logout')
    def logout(self, request):
        cookie = request.COOKIES.get('user')
        if cookie:
            logout(request)
            response = Response({"message": "bye!"}, status=status.HTTP_200_OK)
            response.delete_cookie('user')
            return response
        return Response({"message": "error: 401"}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], url_path='access')
    def access(self, request):
        cookie = request.COOKIES.get('user')
        if cookie:
                return Response({"message": "access granted"}, status=status.HTTP_200_OK)
        return Response({"message": "access denied"}, status=status.HTTP_401_UNAUTHORIZED)
