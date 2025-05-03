import api from "./auth"

export const getPosts = async (queryParams = '') => {
    try {
        const response = await api.get(`/api/posts/${queryParams}`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data);
        throw error;
    }
};

export const deletePost = async(postId) => {
    try {
        const response = await api.delete(`/api/posts/${postId}/`)
        return response.data
    } catch(error){
        throw error
    }
}

export const updatePost = async(postId, updateData) => {
    try {
        const response = await api.patch(`/api/posts/${postId}/`, updateData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createPost = async(postData) => {
    try {
        const response = await api.post("api/posts/", postData)
        return response.data
    } catch(error) {
        throw error
    }
}
