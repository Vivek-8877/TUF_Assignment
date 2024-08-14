import React from 'react';
import { FiEdit3, FiCheck, FiX } from 'react-icons/fi';

const BannerEditControls = ({
    type,
    editing,
    value,
    bannerValue,
    onEditChange,
    onSave,
    startEditing,
    cancelEditing,
}) => {

    return editing === type ? (
        <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <input
                type={type === 'timer' ? 'number' : 'text'}
                value={value}
                onChange={(e) => onEditChange(e.target.value)}
                className="text-black p-2 rounded-lg border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                style={{ width: `${Math.max(value.length + 1, 20)}ch` }}
            />
            <div
                className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-green-400 hover:bg-green-600 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onSave(e);
                }}
                title="Save"
            >
                <FiCheck className="text-white" size={20} />
            </div>
            <div
                className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-red-400 hover:bg-red-600 transition-colors"
                onClick={cancelEditing}
                title="Cancel"
            >
                <FiX className="text-white" size={20} />
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-center space-x-2">
            <p className="text-md truncate cursor-pointer">
                {bannerValue}
            </p>
            <div
                className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-yellow-400 hover:bg-yellow-600 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    startEditing(type);
                }}
                title={`Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            >
                <FiEdit3 className="text-white" size={20} />
            </div>
        </div>
    );
};

export default BannerEditControls;
