import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BannerDisplay from './BannerDisplay';
import CustomAlert from './CustomAlert';
import { localhost } from '../utils/config';

const BannerForm = () => {
    const [banner, setBanner] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [editing, setEditing] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newTimer, setNewTimer] = useState('');
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Function to fetch banner data
    const fetchBannerData = useCallback(() => {
        axios.get(`${localhost}/api/banner`)
            .then(response => {
                const bannerData = response.data;
                if (bannerData) {
                    setBanner(bannerData);
                    setIsVisible(bannerData.isVisible);
                    if (bannerData.timer) {
                        setTimeRemaining(bannerData.timer);
                        setNewTimer(bannerData.timer);
                    }
                    setNewDescription(bannerData.description);
                    setNewLink(bannerData.link);
                }
            })
            .catch(error => {
                console.error('Error fetching banner data:', error);
                setAlert({ show: true, message: 'Failed to load banner data. Backend unable to communicate.', type: 'error' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
            });
    }, []);

    useEffect(() => {
        fetchBannerData(); // Initial fetch
    }, [fetchBannerData]);

    const hideBanner = useCallback(() => {
        setIsVisible(false);
        axios.post(`${localhost}/api/banner`, {
            ...banner,
            isVisible: false,
        })
            .then(response => {
                console.log('Banner visibility toggled:', response.data.status);
                setBanner(prevBanner => ({
                    ...prevBanner,
                    isVisible: false,
                }));
            })
            .catch(error => {
                console.error('Error toggling banner visibility:', error);
                setAlert({ show: true, message: 'Failed to update banner visibility.', type: 'error' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
            });
    }, [banner]);

    useEffect(() => {
        if (timeRemaining > 0 && !isTimerPaused) {
            const interval = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timeRemaining === 0 && isVisible) {
            hideBanner();
        }
    }, [timeRemaining, isTimerPaused, isVisible, hideBanner]);

    
    const toggleBannerVisibility = () => {
        const newVisibility = !isVisible;
    
        if (newVisibility && timeRemaining === 0) {
            // If toggling visibility to on, and the timer had reached zero, reset the timer
            setTimeRemaining(newTimer); // Reset the timer to the original value
            setIsTimerPaused(false); // Start the countdown again
        }
    
        setIsVisible(newVisibility);
    
        // Update visibility in the database
        axios.post(`${localhost}/api/banner`, {
            ...banner,
            isVisible: newVisibility,
        })
            .then(response => {
                console.log('Banner visibility updated:', response.data.status);
                if (newVisibility) {
                    fetchBannerData(); // Fetch fresh data if visibility is toggled on
                }
            })
            .catch(error => {
                console.error('Error toggling banner visibility:', error);
                setAlert({ show: true, message: 'Failed to update banner visibility.', type: 'error' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
            });
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
                setAlert({ show: true, message: 'Banner updated successfully!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            })
            .catch(error => {
                console.error('Error updating banner:', error);
                setAlert({ show: true, message: 'Failed to update banner.', type: 'error' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
            });
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen z-10">
            {alert.show && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            )}

            {isVisible && banner && (
                <div className="relative flex flex-col items-center justify-center bg-gray-800 bg-opacity-80 text-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto w-full min-w-[320px]">
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
