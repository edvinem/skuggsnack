// frontend/src/components/Button.js

import React from 'react';

function Button({ type = 'primary', children, className = '', ...props }) {
    let bgColor, hoverBgColor, focusRingColor, borderColor, hoverBorderColor, textColor;

    switch (type) {
        case 'secondary':
            bgColor = 'bg-gray-700';
            hoverBgColor = 'hover:bg-gray-800';
            focusRingColor = 'focus:ring-gray-800';
            borderColor = 'border-gray-700';
            hoverBorderColor = 'hover:border-gray-800';
            textColor = 'text-white';
            break;
        case 'accent':
            bgColor = 'bg-accent';
            hoverBgColor = 'hover:bg-accent-dark';
            focusRingColor = 'focus:ring-accent-dark';
            borderColor = 'border-accent';
            hoverBorderColor = 'hover:border-accent-dark';
            textColor = 'text-white';
            break;
        case 'primary':
        default:
            bgColor = 'bg-primary';
            hoverBgColor = 'hover:bg-primary-dark';
            focusRingColor = 'focus:ring-primary-dark';
            borderColor = 'border-primary';
            hoverBorderColor = 'hover:border-primary-dark';
            textColor = 'text-white';
            break;
    }

    return (
        <button
            className={`${bgColor} ${hoverBgColor} ${focusRingColor} ${hoverBorderColor} ${textColor} ${borderColor} ${className} border rounded-lg px-4 py-2 font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 shadow-md active:scale-95`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
