import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';
import axios from 'axios';

function ChatWindow({ token }) {
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState('general'); // Default recipient
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/chat/get_messages/${recipient}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
                sender: 'current_user', // Replace with actual username from token
                recipient,
                content,
                recipient_type: 'channel' // Adjust based on recipient type
            };
            await axios.post('/chat/send_message', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
