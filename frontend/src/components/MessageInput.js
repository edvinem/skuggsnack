// frontend/src/components/MessageInput.js
import React, { useState } from 'react';
import Button from './Button';

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
                className="w-full px-3 py-2 mb-2 border rounded bg-gray-700 text-white"
            />
            <Button type="primary" className="w-full py-2 border-[#3BBA9C] text-lg">Send</Button>
        </form>
    );
}

export default MessageInput;
