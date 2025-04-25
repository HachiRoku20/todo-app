from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class BaseModel(models.Model):
    """
    Base model that provides common fields for audit and time tracking.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='+', on_delete=models.CASCADE, blank=True, null=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='+', on_delete=models.CASCADE, blank=True, null=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class CustomUserManager(BaseUserManager):
    """
    Custom user manager to handle user creation and superuser creation.
    """
    def create_user(self, email, password=None,):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for the application, inheriting from AbstractBaseUser.
    Includes additional fields such as profile details, security settings, etc.
    """
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email.split('@')[0]
        super().save(*args, **kwargs)
