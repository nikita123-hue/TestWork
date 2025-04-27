from rest_framework import serializers 
from .models import Comment
from apps.users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'content', 'created_at', 'author', 'post')
        read_only_fields = ('created_at', 'author')