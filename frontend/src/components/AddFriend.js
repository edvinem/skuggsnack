// frontend/src/components/AddFriend.js
import React, { useState, useEffect } from 'react';
import authApi from '../api/authApi';
import Button from './Button';

function AddFriend() {
    const [username, setUsername] = useState('');
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
        }
    };

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
            console.log('Error response:', err.response?.data);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map((item) => item.msg).join(', '));
            } else if (typeof detail === 'string') {
                setError(detail);
            } else {
                setError('An error occurred');
            }
        }
    };

    const handleAcceptFriendRequest = async (requestingUsername) => {
        try {
            const response = await authApi.post('/accept_friend_request', { requesting_username: requestingUsername });
            setSuccessMessage(response.data.message);
            setFriendRequests(friendRequests.filter((u) => u !== requestingUsername));
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to accept friend request');
        }
    };

    return (
        <div className="p-4 bg-primary min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-4">Add Friend</h2>
            {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form onSubmit={handleSendFriendRequest} className="mb-4">
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 mb-2 border rounded bg-gray-700 text-white"
                />
                <Button type="primary" className="w-full px-4 py-2 border-[#3BBA9C] text-lg">Send Friend Request</Button>
            </form>
            <h3 className="text-xl font-semibold mb-2">Pending Friend Requests</h3>
            {friendRequests.length === 0 ? (
                <p>No pending friend requests.</p>
            ) : (
                <ul>
                    {friendRequests.map((username) => (
                        <li key={username} className="flex justify-between items-center mb-2">
                            <span>{username}</span>
                            <Button type="accent" onClick={() => handleAcceptFriendRequest(username)}>
                                Accept
                            </Button>
                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    );
}

export default AddFriend;
