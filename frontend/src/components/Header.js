// frontend/src/components/Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo_tran from '../assets/logo_tran.png';
import AuthContext from '../context/AuthContext';

function Header({ onLogout }) {
    const { token } = useContext(AuthContext);

    return (
        <header className="flex items-center justify-between p-4 bg-blue-600">
            <div className="flex items-center">
                <img src={logo_tran} alt="Logo" className="w-16 h-16 mr-4" />
                <h1 className="text-white text-2xl font-bold">Skuggsnack</h1>
            </div>
            {token && (
                <div>
                    <Link
                        to="/add-friend"
                        className="px-4 py-2 mr-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Add Friend
                    </Link>
                    <Link
                        to="/friend-requests"
                        className="px-4 py-2 mr-2 font-semibold text-white bg-yellow-600 rounded hover:bg-yellow-700"
                    >
                        Friend Requests
                    </Link>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;
