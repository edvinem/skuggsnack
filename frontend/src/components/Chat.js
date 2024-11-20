// frontend/src/components/Chat.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

function Chat() {
    const [recipient, setRecipient] = useState(null);

    const handleSelectFriend = (friendUsername) => {
        setRecipient(friendUsername);
    };

    return (
        <div className="flex h-screen">
            <Sidebar onSelectFriend={handleSelectFriend} />
            <div className="flex flex-col flex-1">
                {recipient ? (
                    <ChatWindow recipient={recipient} />
                ) : (
                    <div className="flex flex-col flex-1 items-center justify-center">
                        <p>Select a friend to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
