// frontend/src/components/Chat.js
import React, { useState } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';

function Chat() {
    const [recipient, setRecipient] = useState(null);

    const handleSelectFriend = (friendUsername) => {
        setRecipient(friendUsername);
    };

    return (
        <div className="flex flex-1 h-full">
            <SideBar onSelectFriend={handleSelectFriend} />
            <div className="flex flex-1">
                {recipient ? (
                    <ChatWindow recipient={recipient} />
                ) : (
                    <div className="flex flex-1 items-center justify-center bg-gray-100">
                        <p className="text-gray-500">Select a friend to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
