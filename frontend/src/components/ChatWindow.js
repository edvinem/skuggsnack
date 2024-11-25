import React, { useState, useEffect, useContext, useRef } from 'react';
import chatApi from '../api/chatApi';
import AuthContext from '../context/AuthContext';

function ChatWindow({ recipient }) {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [recipient]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                recipient_type: 'user', // Ensure recipient_type is correctly set
            };
            const response = await chatApi.post('/send_message', payload);
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message');
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-gray-100">
            <div className="flex-1 overflow-y-auto p-4">
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
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex p-4 bg-white border-t border-gray-200">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 mr-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Send
                </button>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </div>
    );
}

export default ChatWindow;
