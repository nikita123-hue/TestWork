import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "./api/auth";
import "./PostComments.css"

function PostComments() {
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/api/posts/${postId}/`);
            setPost(response.data);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/api/posts/${postId}/comments/`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/posts/${postId}/comments/`, {
                content: newComment,
                post: postId 
            });
            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="comments-container">
            <Link to="/home" className="back-link">
                ← Назад к постам
            </Link>

            {post && (
                <div className="post-card">
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            )}

            <h3>Комментарии ({comments.length})</h3>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишите комментарий..."
                    required
                />
                <button type="submit">Отправить</button>
            </form>

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-author">
                            {comment.author.username}
                        </div>
                        <div className="comment-text">{comment.content}</div>
                        <div className="comment-date">
                            {new Date(comment.created_at).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostComments;
