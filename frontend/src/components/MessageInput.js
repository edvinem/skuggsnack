import React, { useState } from 'react';

function MessageInput({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;
        onSend(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex p-4 bg-gray-100">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 mr-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Send
            </button>
        </form>
    );
}

export default MessageInput;
