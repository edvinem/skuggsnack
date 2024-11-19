// src/App.js

import React, { useContext, useState } from 'react';
import Login from './components/Login';
import ChatWindow from './components/ChatWindow';
import SideBar from './components/SideBar';
import { AuthContext, AuthProvider } from './context/AuthContext';

function AppContent() {
    const { token, user, login, logout } = useContext(AuthContext);
    const [selectedRecipient, setSelectedRecipient] = useState('general');

    if (!token) {
        return <Login onLogin={login} />;
    }

    return (
        <div className="flex h-screen">
            <SideBar onSelectRecipient={setSelectedRecipient} />
            <div className="flex-1 flex flex-col">
                <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
                    <h1 className="text-xl">Skuggsnack Chat - {selectedRecipient}</h1>
                    <button onClick={logout} className="px-3 py-1 bg-red-500 rounded hover:bg-red-600">
                        Logout
                    </button>
                </header>
                <ChatWindow recipient={selectedRecipient} />
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
