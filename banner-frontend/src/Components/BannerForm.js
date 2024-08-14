import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BannerDisplay from './BannerDisplay';
import { localhost } from '../utils/config';

const BannerForm = () => {
    const [banner, setBanner] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [editing, setEditing] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newTimer, setNewTimer] = useState('');
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        axios.get(`${localhost}/api/banner`)
            .then(response => {
                const bannerData = response.data;
                if (bannerData) {
                    setBanner(bannerData);
                    if (bannerData.timer) {
                        setTimeRemaining(bannerData.timer);
                        setNewTimer(bannerData.timer);
                    }
                    setNewDescription(bannerData.description);
                    setNewLink(bannerData.link);
                }
            })
            .catch(error => console.error('Error fetching banner data:', error));
    }, []);

    const hideBanner = useCallback(() => {
        setBanner(prevBanner => ({
            ...prevBanner,
            isVisible: false,
        }));

        axios.post(`${localhost}/api/banner`, {
            ...banner,
            isVisible: false,
        })
            .then(response => {
                console.log('Banner visibility toggled:', response.data.status);
            })
            .catch(error => console.error('Error toggling banner visibility:', error));
    }, [banner]);

    useEffect(() => {
        if (timeRemaining > 0 && !isTimerPaused) {
            const interval = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timeRemaining === 0 && banner?.isVisible) {
            hideBanner();
        }
    }, [timeRemaining, isTimerPaused, banner?.isVisible, hideBanner]);

    const toggleBannerVisibility = () => {
        setIsVisible(prev => !prev);
    };

    const startEditing = (type) => {
        setEditing(type);
        setIsTimerPaused(true);
    };

    const cancelEditing = () => {
        setEditing(null);
        setIsTimerPaused(false);
        setNewDescription(banner.description);
        setNewLink(banner.link);
        setNewTimer(banner.timer);
    };

    const handleSave = (type, newValue) => {
        const updatedBanner = { ...banner };
        if (type === 'description') {
            updatedBanner.description = newValue;
            setNewDescription(newValue);
        } else if (type === 'link') {
            updatedBanner.link = newValue;
            setNewLink(newValue);
        } else if (type === 'timer') {
            const newTimerValue = parseInt(newValue, 10);
            updatedBanner.timer = newTimerValue;
            setNewTimer(newTimerValue);
            setTimeRemaining(newTimerValue);
        }

        setBanner(updatedBanner);
        setEditing(null);
        setIsTimerPaused(false);

        axios.post(`${localhost}/api/banner`, updatedBanner)
            .then(response => {
                console.log('Banner updated:', response.data.status);
            })
            .catch(error => console.error('Error updating banner:', error));
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen z-10">
            {isVisible && (
                <div className="relative flex flex-col items-center justify-center bg-gray-800 bg-opacity-80 text-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto min-w-[320px]">
                    {banner && banner.isVisible && (
                        <BannerDisplay
                            banner={banner}
                            timeRemaining={timeRemaining}
                            editing={editing}
                            newDescription={newDescription}
                            newLink={newLink}
                            newTimer={newTimer}
                            setNewDescription={setNewDescription}
                            setNewLink={setNewLink}
                            setNewTimer={setNewTimer}
                            startEditing={startEditing}
                            cancelEditing={cancelEditing}
                            handleSave={handleSave}
                        />
                    )}
                </div>
            )}

            <button
                className="fixed bottom-4 px-6 py-2 text-lg text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors z-20 cursor-pointer"
                onClick={toggleBannerVisibility}
            >
                {isVisible ? 'Hide Banner' : 'Show Banner'}
            </button>
        </div>
    );
};

export default BannerForm;
