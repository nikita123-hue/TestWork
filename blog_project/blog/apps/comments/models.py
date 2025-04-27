from django.db import models
from apps.users.models import User
from apps.posts.models import Post

class Comment(models.Model):
    content = models.TextField()
    created_at = models.TimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    
    def __str__(self):
        return f"Comment by {self.author} on {self.post}"
