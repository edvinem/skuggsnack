// frontend/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Header from './components/Header';
import Chat from './components/Chat';
import AddFriend from './components/AddFriend';
import FriendRequests from './components/FriendRequests';
import Login from './components/Login';

function App() {
    const { token, handleLogout } = useContext(AuthContext);

    return (
        <Router>
            <Header onLogout={handleLogout} />
            <Routes>
                {token ? (
                    <>
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/add-friend" element={<AddFriend />} />
                        <Route path="/friend-requests" element={<FriendRequests />} />
                        <Route path="*" element={<Navigate to="/chat" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
