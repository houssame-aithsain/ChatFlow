from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django import forms

class CustomUserManager(BaseUserManager):

    def check_email(self, email, username):
        """
        Check if the email is already in use.
        """
        if self.filter(email=email).exists():
            raise forms.ValidationError("Email is already in use")
            
        forms.EmailField().clean(email)

    def create_user(self, username, email, first_name, last_name, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        self.check_email(email, username)
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
    username = models.CharField(max_length=50, unique=True, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    password = models.CharField(max_length=50, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username
