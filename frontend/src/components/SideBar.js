import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SideBar({ token, onSelectRecipient }) {
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState('');

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`/chat/get_conversations/current_user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
    }, []);

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
