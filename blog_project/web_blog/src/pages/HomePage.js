import { useState, useEffect } from "react";
import PostCard from "../components/posts/PostCard";
import NewPostForm from "../components/posts/NewPostForm";
import { getPosts } from "../api/posts";
import "./HomePage.css"

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        count: 0
    });

    const fetchPosts = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await getPosts(`?page=${page}`);
            const postsData = response.data?.results || [];
            
            setPosts(postsData);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(response.data.count / 5), // 5 - ваш page_size
                count: response.data.count
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            fetchPosts(newPage);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <NewPostForm onCreate={() => fetchPosts(pagination.currentPage)} />

            <div className="posts-list">
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onDelete={() => fetchPosts(pagination.currentPage)}
                            onUpdate={() => fetchPosts(pagination.currentPage)}
                        />
                    ))
                ) : (
                    <p className="no-posts">Постов пока нет</p>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        Назад
                    </button>
                    
                    <span>
                        Страница {pagination.currentPage} из {pagination.totalPages}
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
}

export default Home;