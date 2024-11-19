// src/components/SideBar.js

import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // Updated import
import { AuthContext } from '../context/AuthContext'; // Ensure AuthContext is imported

function SideBar({ onSelectRecipient }) {
    const { token, user } = useContext(AuthContext); // Access user information from context
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState('');

    const fetchConversations = async () => {
        try {
            const response = await api.get(`/chat/get_conversations/${user.username}`);
            setConversations(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch conversations');
        }
    };

    useEffect(() => {
        fetchConversations();
        // Optionally, set up polling or WebSocket for real-time updates
        const interval = setInterval(fetchConversations, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [user.username]);

    return (
        <div className="h-full p-4 bg-white border-r">
            <h2 className="mb-4 text-xl font-bold">Conversations</h2>
            {error && <div className="text-red-500">{error}</div>}
            <ul>
                {conversations.map((conv, index) => (
                    <li
                        key={index}
                        className="p-2 mb-2 cursor-pointer hover:bg-gray-200 rounded"
                        onClick={() => onSelectRecipient(conv.participant)}
                    >
                        <div className="flex justify-between">
                            <span>{conv.participant}</span>
                            <span className="text-xs text-gray-500">
                                {new Date(conv.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SideBar;
