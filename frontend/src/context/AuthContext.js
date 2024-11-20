// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken('');
        setUser(null);
        setFriends([]);
        localStorage.removeItem('token');
    };

    const fetchUserData = async () => {
        if (token) {
            try {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const userResponse = await authApi.get('/me');
                const friendsResponse = await authApi.get('/friends');
                setUser(userResponse.data);
                setFriends(friendsResponse.data);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                handleLogout();
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, friends, handleLogin, handleLogout, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
