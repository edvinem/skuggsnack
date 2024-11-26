import React, { createContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';
import chatApi from '../api/chatApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return storedToken ? storedToken : '';
    });
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const fetchUserData = useCallback(async () => {
        if (token) {
            try {
                const response = await authApi.get('/me');
                setUser(response.data);
                setFriends(response.data.friends);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                handleLogout();
            }
        }
    }, [token]);

    const fetchFriends = useCallback(async () => {
        if (token) {
            try {
                const response = await authApi.get('/friends');
                setFriends(response.data);
            } catch (err) {
                console.error('Failed to fetch friends:', err);
            }
        }
    }, [token]);

    const handleLogout = () => {
        setToken('');
        setUser(null);
        setFriends([]);
        setSelectedFriend(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        console.log('Current Token:', token);
        fetchUserData();
    }, [token, fetchUserData]);

    return (
        <AuthContext.Provider value={{ token, user, friends, selectedFriend, setSelectedFriend, handleLogin, handleLogout, fetchFriends }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
