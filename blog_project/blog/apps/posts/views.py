from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import PermissionDenied
from .models import Post, Tag
from .serializer import PostSerializer, TagSerializer

class StandardAPIResponse:
    @staticmethod
    def success(data=None, message=None, status=status.HTTP_200_OK):
        return Response({
            'success': True,
            'data': data,
            'message': message
        }, status=status)

    @staticmethod
    def error(message=None, errors=None, status=status.HTTP_400_BAD_REQUEST):
        return Response({
            'success': False,
            'message': message,
            'errors': errors
        }, status=status)

class PostPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5

    def get_paginated_response(self, data):
        return StandardAPIResponse.success({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-pub_date')
    serializer_class = PostSerializer 
    pagination_class = PostPagination
    authentication_classes = [JWTAuthentication]
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
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.author != self.request.user:
                raise PermissionDenied("Вы не можете редактировать чужой пост")
        return obj
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return StandardAPIResponse.success(data=serializer.data)
    
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            
            post = serializer.save()
            
            tags_data = request.data.get('tags', None)
            if tags_data is not None:
                tags = []
                for tag_name in tags_data:
                    tag, created = Tag.objects.get_or_create(name=tag_name.strip())
                    tags.append(tag)
                post.tags.set(tags)
                
            return StandardAPIResponse.success(
                data=serializer.data,
                message='Post updated successfully'
            )
        except Exception as e:
            return StandardAPIResponse.error(
                message=str(e),
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return StandardAPIResponse.success(
            message='Post deleted successfully'
        )
    
    def handle_exception(self, exc):
        return StandardAPIResponse.error(
            message=str(exc),
            status=self._get_exception_status_code(exc)
        )

class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return StandardAPIResponse.success(data=serializer.data)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return StandardAPIResponse.success(
            data=serializer.data,
            message='Tag created successfully',
            status=status.HTTP_201_CREATED
        )
    
    def handle_exception(self, exc):
        return StandardAPIResponse.error(
            message=str(exc),
            status=self._get_exception_status_code(exc)
        )

class PostTagAddRemoveView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()

    def post(self, request, *args, **kwargs):
        post = self.get_object()
        tag_id = request.data.get('tag_id')
        
        if not tag_id:
            return StandardAPIResponse.error(
                message='tag_id is required',
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            tag = Tag.objects.get(id=tag_id)
        except Tag.DoesNotExist:
            return StandardAPIResponse.error(
                message='Tag not found',
                status=status.HTTP_404_NOT_FOUND
            )
        
        post.tags.add(tag)
        return StandardAPIResponse.success(
            message='Tag added to post successfully'
        )

    def delete(self, request, *args, **kwargs):
        post = self.get_object()
        tag_id = request.data.get('tag_id')
        
        if not tag_id:
            return StandardAPIResponse.error(
                message='tag_id is required',
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            tag = Tag.objects.get(id=tag_id)
        except Tag.DoesNotExist:
            return StandardAPIResponse.error(
                message='Tag not found',
                status=status.HTTP_404_NOT_FOUND
            )
        
        post.tags.remove(tag)
        return StandardAPIResponse.success(
            message='Tag removed from post successfully'
        )
    
    def handle_exception(self, exc):
        return StandardAPIResponse.error(
            message=str(exc),
            status=self._get_exception_status_code(exc)
        )