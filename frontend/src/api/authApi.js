// frontend/src/api/authApi.js

import axios from 'axios';

const authApi = axios.create({
    baseURL: '/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

authApi.interceptors.request.use(
    (config) => {
        if (!config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.warn("No token found in localStorage for request");
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default authApi;
