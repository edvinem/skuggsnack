// frontend/src/components/AddFriendModal.js
import React, { useState } from 'react';
import authApi from '../api/authApi';

function AddFriendModal({ isOpen, onClose }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendFriendRequest = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const payload = { friend_username: username };
            const response = await authApi.post('/send_friend_request', payload);
            setSuccessMessage(response.data.message);
            setUsername('');
        } catch (err) {
            console.error('Error sending friend request:', err);
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                setError(detail);
            } else {
                setError('An error occurred');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Add Friend</h2>
                {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <form onSubmit={handleSendFriendRequest}>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 mb-2 border rounded"
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 mr-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddFriendModal;
