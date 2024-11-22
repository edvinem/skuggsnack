// frontend/src/components/Button.js

import React from 'react';

function Button({ type = 'primary', children, className = '', ...props }) {
    let bgColor, hoverColor, focusRing;

    switch (type) {
        case 'secondary':
            bgColor = 'bg-gray-700';
            hoverColor = 'hover:bg-gray-800';
            focusRing = 'focus:ring-gray-800';
            break;
        case 'accent':
            bgColor = 'bg-primary';
            hoverColor = 'hover:bg-primary-light';
            focusRing = 'focus:ring-primary-dark';
            break;
        default:
            bgColor = 'bg-primary';
            hoverColor = 'hover:bg-primary-light';
            focusRing = 'focus:ring-primary-dark';
    }

    return (
        <button
            className={`${bgColor} ${hoverColor} text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${focusRing} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
