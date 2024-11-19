import React, { useState, useEffect, useContext } from 'react';
import MessageInput from './MessageInput';
import api from '../api/axios'; // Updated import
import { AuthContext } from '../context/AuthContext'; // Ensure AuthContext is imported

function ChatWindow({ recipient }) {
    const { token, user } = useContext(AuthContext); // Access user information from context
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/get_messages/${recipient}`);
            setMessages(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch messages');
        }
    };

    useEffect(() => {
        fetchMessages();
        // Optionally, set up polling or WebSocket for real-time updates
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [recipient]);

    const handleSendMessage = async (content) => {
        try {
            const payload = {
                sender: user.username, // Extracted from AuthContext
                recipient,
                content,
                recipient_type: 'channel', // Adjust based on recipient type
            };
            await api.post('/chat/send_message', payload);
            fetchMessages();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send message');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {error && <div className="text-red-500">{error}</div>}
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.sender}</strong>
                        <p>{msg.content}</p>
                        <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
}

export default ChatWindow;
