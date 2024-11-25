// frontend/src/components/SideBar.js

import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

function SideBar() {
    const { friends, fetchFriends, setSelectedFriend } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    useEffect(() => {
        setFilteredFriends(
            friends.filter(friend => friend.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, friends]);

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
    };

    return (
        <aside className="w-64 bg-primary text-white p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Friends</h2>
            <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-2 border rounded bg-gray-700 text-white"
            />
            {filteredFriends && filteredFriends.length > 0 ? (
                <ul>
                    {filteredFriends.map((friend) => (
                        <li
                            key={friend}
                            className="mb-2 cursor-pointer hover:text-blue-400"
                            onClick={() => handleSelectFriend(friend)}
                        >
                            {friend}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">No friends found.</p>
            )}
        </aside>
    );
}

export default SideBar;
