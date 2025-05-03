// components/NewPostForm.jsx
import { useState } from "react";
import { createPost } from "../../api/posts";
import "./NewPostForm.css"

const NewPostForm = ({ onCreate }) => {
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        tags: []
    });
    const [newTag, setNewTag] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagChange = (e) => {
        setNewTag(e.target.value);
    };

    const addTag = () => {
        if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
            setPostData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setPostData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            console.log(postData)
            await createPost(postData);
            setPostData({ title: "", content: "", tags: [] });
            onCreate(); 
        } catch (err) {
            setError(err.response?.data?.message || "Не удалось создать пост");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="new-post-form">
            <h2>Новый пост</h2>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Заголовок</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Содержание</label>
                    <textarea
                        id="content"
                        name="content"
                        value={postData.content}
                        onChange={handleChange}
                        required
                        rows={5}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Теги</label>
                    <div className="tags-input-container">
                        <input
                            type="text"
                            id="tags"
                            value={newTag}
                            onChange={handleTagChange}
                            placeholder="Добавьте тег и нажмите Enter"
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <button 
                            type="button" 
                            onClick={addTag}
                            className="add-tag-btn"
                        >
                            Добавить
                        </button>
                    </div>
                    
                    <div className="tags-list">
                        {postData.tags.map(tag => (
                            <span key={tag} className="tag">
                                {tag}
                                <button 
                                    type="button" 
                                    onClick={() => removeTag(tag)}
                                    className="remove-tag-btn"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={
                        isSubmitting || !postData.content
                    }
                    className="submit-btn"
                >
                    {isSubmitting ? "Создание..." : "Опубликовать"}
                </button>
            </form>
        </div>
    );
};

export default NewPostForm;