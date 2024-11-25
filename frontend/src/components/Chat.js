import React, { useContext } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
import AuthContext from '../context/AuthContext';

function Chat() {
    const { selectedFriend } = useContext(AuthContext);

    return (
        <div className="flex flex-1 h-full">
            <SideBar />
            <div className="flex flex-1">
                {selectedFriend ? (
                    <ChatWindow recipient={selectedFriend} />
                ) : (
                    <div className="flex flex-1 items-center justify-center bg-primary">
                        <p className="text-gray-500">Select a friend to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
