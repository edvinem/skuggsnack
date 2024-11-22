// frontend/src/components/Button.js

import React from 'react';

function Button({ type = 'primary', children, className = '', ...props }) {
    let bgColor, hoverColor, focusRing, hoverBorderColor;

    switch (type) {
        case 'secondary':
            bgColor = 'bg-gray-700';
            hoverColor = 'hover:bg-gray-800';
            focusRing = 'focus:ring-gray-800';
            hoverBorderColor = 'hover:border-gray-800';
            break;
        case 'accent':
            bgColor = 'bg-accent';
            hoverColor = 'hover:bg-accent-dark';
            focusRing = 'focus:ring-accent-dark';
            hoverBorderColor = 'hover:border-accent-dark';
            break;
        case 'primary':
        default:
            bgColor = 'bg-blue-500';
            hoverColor = 'hover:bg-blue-600';
            focusRing = 'focus:ring-blue-600';
            hoverBorderColor = 'hover:border-[#3BBA9C]';
            break;
    }

    return (
        <button
            className={`${bgColor} ${hoverColor} ${focusRing} ${hoverBorderColor} ${className} border-2 rounded-lg focus:outline-none`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;