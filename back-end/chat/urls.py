from . import views
from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'sessions', views.SessionsManager, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]
