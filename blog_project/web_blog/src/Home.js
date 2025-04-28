import { useEffect, useState } from "react";
import { getPosts, deletePost, updatePost, createPost } from "./api/posts";
import { Link } from 'react-router-dom'
import "./Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: "",
        content: "",
    });
    const [newPostData, setNewPostData] = useState({
        title: "",
        content: "",
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId);
            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditClick = (post) => {
        setEditingPostId(post.id);
        setEditFormData({ title: post.title, content: post.content });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewPostChange = (e) => {
        const { name, value } = e.target;
        setNewPostData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await createPost(newPostData);
            setNewPostData({ title: "", content: "" });
            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updatePost(editingPostId, editFormData);
            setEditingPostId(null);
            setEditFormData({ title: "", content: "" });
            fetchPosts();
        } catch (error) {
            console.error("Ошибка при обновлении поста:", error);
        }
    };

    return (
        <div className="home-container">
            <h1 className="page-title">Посты</h1>

            <form onSubmit={handleCreatePost} className="post-form">
                <h2 className="form-title">Создать новый пост</h2>
                <div className="input-group">
                    <input
                        type="text"
                        name="title"
                        value={newPostData.title}
                        onChange={handleNewPostChange}
                        placeholder="Заголовок"
                        className="form-input"
                        required
                    />
                </div>
                <div className="input-group">
                    <textarea
                        name="content"
                        value={newPostData.content}
                        onChange={handleNewPostChange}
                        placeholder="Содержание"
                        className="form-input textarea"
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Создать
                </button>
            </form>

            <div className="posts-list">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={`post-card ${
                            editingPostId === post.id ? "editing" : ""
                        }`}
                    >
                        {editingPostId === post.id ? (
                            <div className="edit-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="title"
                                        value={editFormData.title}
                                        onChange={handleEditChange}
                                        placeholder="Заголовок"
                                        className="form-input"
                                    />
                                </div>
                                <div className="input-group">
                                    <textarea
                                        name="content"
                                        value={editFormData.content}
                                        onChange={handleEditChange}
                                        placeholder="Содержание"
                                        className="form-input textarea"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        onClick={handleUpdate}
                                        className="submit-btn save-btn"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        onClick={() => setEditingPostId(null)}
                                        className="cancel-btn"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-content">{post.content}</p>
                                <div className="post-actions">
                                    <button
                                        onClick={() => handleEditClick(post)}
                                        className="action-btn edit-btn"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="action-btn delete-btn"
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
                ))}
            </div>
        </div>
    );
}

export default Home;
