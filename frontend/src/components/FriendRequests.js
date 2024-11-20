// frontend/src/components/FriendRequests.js
import React, { useState, useEffect } from 'react';
import authApi from '../api/authApi';

function FriendRequests() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await authApi.get('/friend_requests');
            setFriendRequests(response.data);
        } catch (err) {
            console.error('Failed to fetch friend requests:', err);
            setError('Failed to fetch friend requests');
        }
    };

    const handleAcceptFriendRequest = async (username) => {
        try {
            const response = await authApi.post('/accept_friend_request', { requesting_username: username });
            setSuccessMessage(response.data.message);
            setFriendRequests(friendRequests.filter((u) => u !== username));
        } catch (err) {
            console.error('Failed to accept friend request:', err);
            setError('Failed to accept friend request');
        }
    };

    return (
        <div className="p-4 bg-gray-800 text-white min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
            {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {friendRequests.length === 0 ? (
                <p>No pending friend requests.</p>
            ) : (
                <ul>
                    {friendRequests.map((username) => (
                        <li key={username} className="flex justify-between items-center mb-2">
                            <span>{username}</span>
                            <button
                                onClick={() => handleAcceptFriendRequest(username)}
                                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Accept
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FriendRequests;
