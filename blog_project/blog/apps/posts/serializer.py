from rest_framework import serializers # type: ignore
from .models import Post, Tag
from apps.users.serializers import UserSerializer

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name',)

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(
            many=True,
            slug_field='name',
            queryset=Tag.objects.all(),
            required=False
        )    
    class Meta:
        model = Post 
        fields = ('id', 'title', 'content', 'pub_date', 'author', 'tags')
        
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
            post.tags.add(tag)
            
        return post

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tags'] = [tag.name for tag in instance.tags.all()]
        return representation