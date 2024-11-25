// frontend/src/components/Header.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from './Button';

function Header({ onLogout }) {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (token) {
            navigate('/chat');
        } else {
            navigate('/');
        }
    };

    return (
        <header className="flex items-center justify-between p-4 bg-primary">
            <div
                className="flex items-center cursor-pointer"
                onClick={handleLogoClick}
            >
                <h1 className="text-accent text-3xl font-bold">Skuggsnack</h1>
            </div>
            {token && (
                <div className="flex items-center space-x-2">
                    <Link to="/add-friend">
                        <Button type="secondary">Add Friend</Button>
                    </Link>
                    <Button type="accent" onClick={onLogout}>
                        Logout
                    </Button>
                </div>
            )}
        </header>
    );
}

export default Header;
