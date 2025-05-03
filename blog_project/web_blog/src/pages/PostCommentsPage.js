import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/auth";
import "./PostCommentPage.css"

function PostComments() {
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [post, setPost] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [postResponse, commentsResponse] = await Promise.all([
                api.get(`/api/posts/${postId}/`),
                api.get(`/api/posts/${postId}/comments/`),
            ]);

            setPost(postResponse.data);
            setComments(
                commentsResponse.data.data || commentsResponse.data || []
            );
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, [postId]);

    useEffect(() => {
        fetchData();
    }, [postId, fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/posts/${postId}/comments/`, {
                content: newComment,
            });
            setNewComment("");
            const response = await api.get(`/api/posts/${postId}/comments/`);
            setComments(response.data.data || response.data || []);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/api/posts/${postId}/${commentId}/`);
            await fetchData();
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Не удалось удалить комментарий");
        }
    };

    return (
        <div className="comments-container">
            <Link to="/home" className="back-link">
                ← Назад к постам
            </Link>

            {post && (
                <div className="post-card">
                    <div className="post-meta">
                        <span className="post-author">
                            {post.data.author.username || "Неизвестный автор"}  
                        </span>
                    </div>
                    <h2>{post.data.title}</h2>
                    <p>{post.data.content}</p>
                </div>
            )}

            <h3>Комментарии ({comments.length})</h3>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишите комментарий..."
                    required
                    minLength={3}
                />
                <button type="submit" disabled={!newComment.trim()}>
                    Отправить
                </button>
            </form>

            {comments.length > 0 ? (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">
                                    {comment.author?.username || "Аноним"}
                                </span>
                                <span className="comment-date">
                                    {new Date(
                                        comment.created_at
                                    ).toLocaleString()}
                                </span>
                                <button
                                    className="delete-comment-btn"
                                    onClick={() =>
                                        handleDeleteComment(comment.id)
                                    }
                                    title="Удалить комментарий"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="comment-text">
                                {comment.content}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-comments">Пока нет комментариев</p>
            )}
        </div>
    );
}

export default PostComments;
