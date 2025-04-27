from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer   
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
