// frontend/src/components/Chat.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import MessageInput from './MessageInput';
import { FiLogOut } from 'react-icons/fi'; // Optional: Add icons

function Chat() {
    const { token, handleLogout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [recipient, setRecipient] = useState('general'); // Default channel or user

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
                sender: 'current_user', // Replace with actual username from context or state
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
        <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between p-4 bg-blue-500">
                <h2 className="text-white text-lg font-semibold">Chat - {recipient}</h2>
                <button onClick={handleLogout} className="text-white">
                    <FiLogOut size={24} />
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded ${msg.sender === 'current_user' ? 'bg-blue-200 self-end' : 'bg-white'}`}>
                        <strong>{msg.sender}</strong>
                        <p>{msg.content}</p>
                        <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-white">
                <MessageInput onSend={handleSendMessage} />
            </div>
        </div>
    );
}

export default Chat;
