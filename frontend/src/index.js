import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';  // This should now correctly point to frontend/src/styles.css
import App from './App';

// Creating the root element and rendering the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
