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
        setError('');
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
        <div className="flex flex-col flex-1 h-full bg-primary">
            <div className="p-4">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-4 p-3 rounded-lg max-w-xs ${msg.sender === user.username
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-300 text-gray-900'
                                }`}
                        >
                            <p>{msg.content}</p>
                            <span className="block text-xs text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center p-4 bg-primary space-x-2">
                <label htmlFor="message-input" className="sr-only">Message</label>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-lg font-semibold text-white bg-primary-dark rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark"
                >
                    Send
                </button>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </div>
    );
}

export default ChatWindow;
