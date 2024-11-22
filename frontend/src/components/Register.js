// frontend/src/components/Register.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import AuthContext from '../context/AuthContext';
import authApi from '../api/authApi'; // Ensure you have this setup

function Register() {
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext); // Optional: Auto-login after registration
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await authApi.post('/register', { username, password });
            if (response.status === 200 || response.status === 201) {
                setSuccessMessage(response.data.message || 'Registration successful!');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                // Optionally, redirect to login page after a short delay
                setTimeout(() => navigate('/'), 2000);
                // Optionally, auto-login the user
                // handleLogin(response.data.token);
            } else {
                setError(response.data.detail || 'Registration failed.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2E3047]">
            <div className="w-full max-w-md p-8 bg-[#2E3047] border border-[#3BBA9C] rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-center text-[#3BBA9C]">Register</h2>
                {successMessage && <div className="mb-4 text-green-500 text-center">{successMessage}</div>}
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
                    <div className="mb-4">
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
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block mb-2 text-md font-medium text-[#3BBA9C]">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-[#2E3047] border border-[#3BBA9C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3BBA9C]"
                            required
                        />
                    </div>
                    <Button type="primary" className="w-full py-2 border-[#3BBA9C] text-lg">Register</Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-300">
                        Already have an account? <Link to="/" className="text-[#3BBA9C] hover:underline">Login here</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
