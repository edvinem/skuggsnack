// frontend/src/components/ChatWindow.js
import React, { useState, useEffect, useContext } from 'react';
import chatApi from '../api/chatApi';
import AuthContext from '../context/AuthContext';

function ChatWindow({ recipient }) {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
        // Optionally, set up polling or WebSocket for real-time updates
    }, [recipient]);

    const fetchMessages = async () => {
        if (!recipient) return;
        try {
            const response = await chatApi.get(`/get_messages/${recipient}`);
            const data = response.data;
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error('Expected an array but got:', data);
                setMessages([]);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError('Failed to fetch messages');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const payload = {
                recipient,
                content: newMessage,
                recipient_type: 'user',
            };
            const response = await chatApi.post('/send_message', payload);
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message');
        }
    };

    return (
        <div className="flex flex-col flex-1 p-4 bg-gray-100">
            <div className="flex-1 overflow-y-auto mb-4">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 p-2 rounded ${msg.sender === user.username ? 'bg-blue-200 self-end' : 'bg-white'
                                }`}
                        >
                            <strong>{msg.sender}</strong>
                            <p>{msg.content}</p>
                            <span className="text-xs text-gray-500">
                                {new Date(msg.timestamp).toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="flex">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-l"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                >
                    Send
                </button>
            </form>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
}

export default ChatWindow;
