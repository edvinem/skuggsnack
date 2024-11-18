import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleToggle = () => {
        setIsRegister(!isRegister);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        const payload = isRegister ? { username, password } : { username, password };

        try {
            const response = await axios.post(endpoint, payload);
            const { access_token } = response.data;
            onLogin(access_token);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
            <h1 className="text-2xl font-bold text-center">{isRegister ? 'Register' : 'Login'}</h1>
            {error && <div className="text-red-500 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    {isRegister ? 'Register' : 'Login'}
                </button>
            </form>
            <p className="text-center">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={handleToggle} className="ml-2 text-blue-600 hover:underline">
                    {isRegister ? 'Login' : 'Register'}
                </button>
            </p>
        </div>
    );
}

export default Login;
