import React, { useState } from 'react';
import authApi from '../api/authApi';  // Use authApi instead of api


function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleToggle = () => {
        setIsRegister(!isRegister);
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        const endpoint = isRegister ? '/register' : '/login';
        const payload = { username, password };

        try {
            const response = await authApi.post(endpoint, payload);
            if (isRegister) {
                // Handle registration success
                setIsRegister(false);
                setSuccessMessage('Registration successful. Please log in.');
                setUsername('');
                setPassword('');
            } else {
                const { access_token } = response.data;
                onLogin(access_token);
            }
        } catch (err) {
            console.log('Error response:', err.response?.data);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                // Handle validation errors
                setError(detail.map((item) => item.msg).join(', '));
            } else if (typeof detail === 'string') {
                setError(detail);
            } else {
                setError('An error occurred');
            }
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-lg p-10 space-y-6 bg-gray-900 rounded shadow-lg">
                <h1 className="text-2xl font-bold text-center text-white">
                    {isRegister ? 'Register' : 'Login'}
                </h1>
                {successMessage && (
                    <div className="text-green-500 text-center">{successMessage}</div>
                )}
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block mb-1 text-white">Username</label>
                        <input
                            type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-white">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-white">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={handleToggle} className="ml-2 text-white-500 hover:underline">
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
