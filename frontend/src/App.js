// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Chat from './components/Chat';
import AuthContext from './context/AuthContext';
import api from './api/axios';

function App() {
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
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={token ? <Navigate to="/chat" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/chat" element={token ? <Chat /> : <Navigate to="/" />} />
                    {/* Add more routes as needed */}
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
