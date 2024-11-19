// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (err) {
                    console.error('Failed to fetch user:', err);
                    handleLogout();
                }
            }
        };
        fetchUser();
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
