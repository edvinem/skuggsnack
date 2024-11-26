
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import AddFriend from './components/AddFriend';

function App() {
    const { token, handleLogout, handleLogin } = useContext(AuthContext);

    return (
        <Router>
            <Header onLogout={handleLogout} />
            <Routes>
                {token ? (
                    // authenticated users
                    <>
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/add-friend" element={<AddFriend />} />
                        <Route path="*" element={<Navigate to="/chat" />} />
                    </>
                ) : (
                    // unauthenticated users
                    <>
                        <Route path="/" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
