import React, { createContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return storedToken ? storedToken : ''; // Fallback to empty string
    });
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const fetchUserData = async () => {
        if (token) {
            try {
                const response = await authApi.get('/me');
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        setToken('');
        setUser(null);
        setFriends([]);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        console.log('Current Token:', token);
        fetchUserData();
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, friends, handleLogin, handleLogout, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
