from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from .serializers import CommentSerializer

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

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        if post_id:
            return Comment.objects.filter(post_id=post_id).select_related('author', 'post')
        return Comment.objects.all().select_related('author', 'post')
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().order_by('-created_at'))
        serializer = self.get_serializer(queryset, many=True)
        return StandardAPIResponse.success(data=serializer.data)
    
    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return StandardAPIResponse.error(
                message="Authentication credentials were not provided",
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return StandardAPIResponse.success(
            data=serializer.data,
            message='Comment created successfully',
            status=status.HTTP_201_CREATED
        )
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        serializer.save(author=self.request.user, post_id=post_id)

class IsCommentOwnerOrPostOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or obj.post.author == request.user

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsCommentOwnerOrPostOwner]
    queryset = Comment.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return StandardAPIResponse.success(data=serializer.data)
    
    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return StandardAPIResponse.error(
                message="Authentication credentials were not provided",
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return StandardAPIResponse.success(
            data=serializer.data,
            message='Comment updated successfully'
        )
    
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return StandardAPIResponse.error(
                message="Authentication credentials were not provided",
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        instance = self.get_object()
        self.perform_destroy(instance)
        return StandardAPIResponse.success(
            message='Comment deleted successfully'
        )
    
    def handle_exception(self, exc):
        if isinstance(exc, PermissionDenied):
            return StandardAPIResponse.error(
                message=str(exc),
                status=status.HTTP_403_FORBIDDEN
            )
        return super().handle_exception(exc)