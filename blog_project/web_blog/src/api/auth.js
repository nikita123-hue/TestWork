import axios from 'axios'

const API_URL = "http://localhost:8000"

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 5000,
    headers:{
        "Content-Type":"application/json"
    }
})

export const login = async (username, password) => {
    try {
        const response = await api.post("/api/auth/login/", {username, password})
        return response.data
    } catch(error) {
        throw error
    }
}

export const register = async(username, email, password) => {
    try {
        const response = await api.post("/api/auth/register/", {
            username,
            email, 
            password
        })
        return response.data
    } catch(error) {
        throw error
    }
}

export default api