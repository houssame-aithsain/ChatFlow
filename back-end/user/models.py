from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django import forms
from django.core.exceptions import ValidationError
import re

class UppercaseValidator:
    def __init__(self, min_length=8):
        self.min_length = min_length

    def validate(self, password, user=None):
        if len(password) < self.min_length:
            raise ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', password):
            raise ValidationError("Password must contain at least one uppercase letter.")

    def get_help_text(self):
        return f"Your password must contain at least one uppercase letter."


class CustomUserManager(BaseUserManager):

    def check_email(self, email):
        """
        Check if the email is already in use.
        """
        if self.filter(email=email).exists():
            raise forms.ValidationError("Email is already in use")
            
        forms.EmailField().clean(email)

    def check_username(self, username):
        """
        Check if the username is already in use.
        """
        if self.filter(username=username).exists():
            raise forms.ValidationError("Username is already in use")
            
        forms.CharField().clean(username)

    def create_user(self, username, email, first_name, last_name, password, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        self.check_email(email)
        self.check_username(username)
        UppercaseValidator().validate(password)
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, first_name, last_name, password=None, **extra_fields):
        """
        Create and return a superuser with an email, password, and other fields.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, first_name, last_name, password, **extra_fields)

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=254, unique=True, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    first_name = models.CharField(max_length=254, null=False)
    last_name = models.CharField(max_length=254, null=False)
    password = models.CharField(max_length=254, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_authenticated = models.BooleanField(default=False)
    ai_model_id = models.CharField(max_length=254, null=True, default="gemma2-9b-it")
    TOKEN = models.CharField(max_length=1000, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username
