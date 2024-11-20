// frontend/src/components/Sidebar.js
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function SideBar({ onSelectFriend }) {
    const { friends } = useContext(AuthContext);

    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Friends</h2>
            {friends && friends.length > 0 ? (
                <ul>
                    {friends.map((friend) => (
                        <li
                            key={friend}
                            className="mb-2 cursor-pointer hover:text-blue-400"
                            onClick={() => onSelectFriend(friend)}
                        >
                            {friend}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No friends yet.</p>
            )}
        </aside>
    );
}

export default SideBar;
