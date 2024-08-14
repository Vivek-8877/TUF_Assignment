import React from 'react';

const CustomAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    let alertClass = '';
    if (type === 'error') {
        alertClass = 'bg-red-500 text-white';
    } else if (type === 'success') {
        alertClass = 'bg-green-500 text-white';
    } else {
        alertClass = 'bg-gray-500 text-white';
    }

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${alertClass} z-50`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-lg font-bold">×</button>
            </div>
        </div>
    );
};

export default CustomAlert;
