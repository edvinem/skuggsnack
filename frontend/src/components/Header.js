// frontend/src/components/Header.js
import React from 'react';
import logo from '../assets/logo.png';
function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-blue-600">
            <div className="flex items-center">
                <img src={logo} alt="Skuggsnack Logo" className="w-10 h-10 mr-3" />
                <h1 className="text-white text-xl font-bold">Skuggsnack</h1>
            </div>
            {/* Add navigation links or user profile here if needed */}
        </header>
    );
}

export default Header;
