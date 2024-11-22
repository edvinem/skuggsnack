import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from './Button';

function Login({ onLogin }) {
    const { handleLogin } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const contentType = response.headers.get('content-type');
            if (response.ok && contentType && contentType.includes('application/json')) {
                const data = await response.json();
                handleLogin(data.token);
            } else {
                const errorText = await response.text();
                setError(errorText || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2E3047]">
            <div className="w-full max-w-md p-8 bg-[#2E3047] border border-[#3BBA9C] rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-center text-[#3BBA9C]">Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2 text-md font-medium text-[#3BBA9C]">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-[#2E3047] border border-[#3BBA9C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3BBA9C]"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-md font-medium text-[#3BBA9C]">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-[#2E3047] border border-[#3BBA9C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3BBA9C]"
                            required
                        />
                    </div>
                    <Button type="primary" className="w-full py-2 border-[#3BBA9C] text-lg">Login</Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-300">Don't have an account? <Link to="/register" className="text-[#3BBA9C] hover:underline">Register here</Link>.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;