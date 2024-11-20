// frontend/src/api/authApi.js
import axios from 'axios';

const authApi = axios.create({
    baseURL: '/auth',
});

authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default authApi;
