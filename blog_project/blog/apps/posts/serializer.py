from rest_framework import serializers # type: ignore
from .models import Post, Tag
from apps.users.serializers import UserSerializer

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post 
        fields = ('id', 'title', 'content', 'pub_date', 'author', 'tags')