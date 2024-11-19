// frontend/src/components/MessageInput.js
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi'; // Optional: Add icons

function MessageInput({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;
        onSend(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700">
                <FiSend size={20} />
            </button>
        </form>
    );
}

export default MessageInput;
