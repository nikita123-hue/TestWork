import { useState } from "react";
import { Link } from "react-router-dom";
import { updatePost, deletePost } from "../../api/posts";
import "./PostCard.css"

const PostCard = ({ post, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ 
        title: post.title,
        content: post.content,
        tags: post.tags || []
    });

    const handleUpdate = async () => {
        try {
            await updatePost(post.id, {
                title: editData.title,
                content: editData.content,
                tags: editData.tags
            });
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(post.id);
            onUpdate(); 
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Не удалось удалить пост");
        }
    };

    const handleTagClick = (tag) => {
        if (isEditing) {
            setEditData(prev => ({
                ...prev,
                tags: prev.tags.filter(t => t !== tag)
            }));
        }
    };

    return (
        <div className={`card ${isEditing ? "editing" : ""}`}>
            {isEditing ? (
                <div className="edit-form">
                    <input
                        className="edit-input"
                        value={editData.title}
                        onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                        }
                        placeholder="Заголовок"
                    />
                    <textarea
                        className="edit-textarea"
                        value={editData.content}
                        onChange={(e) =>
                            setEditData({ ...editData, content: e.target.value })
                        }
                        placeholder="Содержание"
                    />
                    
                    {editData.tags.length > 0 && (
                        <div className="tags-container">
                            {editData.tags.map(tag => (
                                <span 
                                    key={tag} 
                                    className="tag editable"
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag} ×
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            className="save-btn"
                            onClick={handleUpdate}
                        >
                            Сохранить
                        </button>
                        <button 
                            className="cancel-btn"
                            onClick={() => setIsEditing(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="post-header">
                    <div className="post-meta">
                            <span className="post-author">
                                {post.author?.username || 'Неизвестный автор'}
                            </span>
                            <span className="post-date">
                                {new Date(post.pub_date).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="post-title">{post.title}</h3>
                    </div>
                    
                    <p className="post-content">{post.content}</p>
                    
                    {post.tags && post.tags.length > 0 && (
                        <div className="tags-container">
                            {post.tags.map(tag => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="post-actions">
                        <button 
                            className="action-btn edit-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать
                        </button>
                        <button 
                            className="action-btn delete-btn"
                            onClick={handleDelete}
                        >
                            Удалить
                        </button>
                        <Link 
                            to={`/posts/${post.id}/comments`}
                            className="action-btn comments-btn"
                        >
                            Комментарии
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostCard;