from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def login(request):
    data = {'username': 'admin', 'password': 'admin'}
    return Response(data)

@api_view(['GET'])
def register(request):
    data = {'username': 'admin', 'password': 'admin'}
    return Response(data)
