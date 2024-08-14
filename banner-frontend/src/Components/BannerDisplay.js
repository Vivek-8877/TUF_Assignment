import React from 'react';
import BannerEditControls from './BannerEditControls';
import { formatTime } from '../utils/utils';

const BannerDisplay = ({
    banner,
    timeRemaining,
    editing,
    newDescription,
    newLink,
    newTimer,
    setNewDescription,
    setNewLink,
    setNewTimer,
    startEditing,
    cancelEditing,
    handleSave,
}) => {

    const handleBannerClick = (e) => {
        if (banner.link && !editing) {
            e.stopPropagation();
            window.open(banner.link, '_blank');
        }
    };

    return (
        <div
            className="bg-gray-900 text-white w-full max-w-6xl mx-auto my-4 p-6 rounded-lg shadow-lg text-center cursor-pointer"
            style={{ fontSize: banner.description.length > 100 ? '1rem' : '1.25rem' }}
            onClick={handleBannerClick}
        >
            <div className="relative">
                <BannerEditControls
                    type="description"
                    editing={editing}
                    value={newDescription}
                    bannerValue={banner.description}
                    onEditChange={setNewDescription}
                    onSave={() => handleSave('description', newDescription)}
                    startEditing={startEditing}
                    cancelEditing={cancelEditing}
                />

                <div className="flex items-center justify-center space-x-2 mt-4">
                    <p className="text-md">Remaining Time</p>
                    <BannerEditControls
                        type="timer"
                        editing={editing}
                        value={newTimer}
                        bannerValue={formatTime(timeRemaining)}
                        onEditChange={setNewTimer}
                        onSave={() => handleSave('timer', newTimer)}
                        startEditing={startEditing}
                        cancelEditing={cancelEditing}
                    />
                </div>

                <div className="flex items-center justify-center space-x-2 mt-4">
                    <BannerEditControls
                        type="link"
                        editing={editing}
                        value={newLink}
                        bannerValue={banner.link || 'No link provided'}
                        onEditChange={setNewLink}
                        onSave={() => handleSave('link', newLink)}
                        startEditing={startEditing}
                        cancelEditing={cancelEditing}
                    />
                </div>
            </div>
        </div>
    );
};

export default BannerDisplay;
