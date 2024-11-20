// frontend/src/api/chatApi.js
import axios from 'axios';

const chatApi = axios.create({
    baseURL: '/chat',  // Base URL includes '/chat'
});

chatApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default chatApi;
