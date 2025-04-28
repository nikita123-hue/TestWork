from django.shortcuts import render
from rest_framework import generics, permissions
from .serializer import PostSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Post

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  

class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return Post.objects.filter(author=self.request.user)
        return super().get_queryset()
