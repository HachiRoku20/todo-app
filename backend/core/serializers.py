from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        login = attrs.get("username")
        password = attrs.get("password")

        if not login or not password:
            raise serializers.ValidationError(_("Must include 'username' or 'email' and 'password'."))

        # authenticate using either email or username
        user = authenticate(request=self.context.get("request"), username=login, password=password)

        if not user:
            raise serializers.ValidationError(_("No active account found with the given credentials"))

        self.user = user
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        return token
