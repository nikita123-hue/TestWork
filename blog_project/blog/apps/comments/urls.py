from django.urls import path
from .views import CommentListCreateView, CommentRetrieveUpdateDestroyView

urlpatterns = [
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('posts/<int:post_id>/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-retrieve-update-destroy'),
]