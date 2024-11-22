// frontend/src/api/authApi.js

import axios from 'axios';

const authApi = axios.create({
    baseURL: '/auth', // Proxy handled by Nginx
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for handling tokens
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authApi;
