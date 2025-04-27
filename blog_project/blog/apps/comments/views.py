from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer

class CommentListCreateView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        serializer.save(author=self.request.user, post_id=post_id)
        
class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.request.method in ['PUT','PATCH','DELETE']:
            return super().get_queryset()
        return Comment.objects.all()