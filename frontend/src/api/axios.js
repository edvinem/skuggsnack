import axios from 'axios';

// Create an Axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/',
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor to handle global responses or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes or errors globally
    return Promise.reject(error);
  }
);

export default api;
