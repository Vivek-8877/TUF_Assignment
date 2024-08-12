import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit3, FiCheck, FiX } from 'react-icons/fi'; // Import icons

const BannerForm = () => {
    const [banner, setBanner] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [editing, setEditing] = useState(null); // Single state for editing mode
    const [newDescription, setNewDescription] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newTimer, setNewTimer] = useState('');
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/banner')
            .then(response => {
                const bannerData = response.data;
                if (bannerData) {
                    console.log('Fetched banner:', bannerData);
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

        axios.post('http://localhost:5000/api/banner', {
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
        if (banner) {
            const updatedBanner = { ...banner, isVisible: !banner.isVisible };

            if (updatedBanner.isVisible && timeRemaining === 0) {
                setTimeRemaining(banner.timer);
            }

            setBanner(updatedBanner);

            axios.post('http://localhost:5000/api/banner', updatedBanner)
                .then(response => {
                    console.log('Banner visibility toggled:', response.data.status);
                })
                .catch(error => console.error('Error toggling banner visibility:', error));
        }
    };

    const handleBannerClick = (e) => {
        if (banner && banner.link && !editing) {
            e.stopPropagation(); // Prevent propagation to avoid redirection
            window.open(banner.link, '_blank');
        }
    };

    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
    };

    const handleLinkChange = (e) => {
        setNewLink(e.target.value);
    };

    const handleTimerChange = (e) => {
        setNewTimer(e.target.value);
    };

    const saveDescription = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const updatedBanner = { ...banner, description: newDescription };
        setBanner(updatedBanner);
        setEditing(null); // End editing mode
        setIsTimerPaused(false); // Resume the timer

        axios.post('http://localhost:5000/api/banner', updatedBanner)
            .then(response => {
                console.log('Banner description updated:', response.data.status);
            })
            .catch(error => console.error('Error updating banner description:', error));
    };

    const saveLink = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const updatedBanner = { ...banner, link: newLink };
        setBanner(updatedBanner);
        setEditing(null);
        setIsTimerPaused(false); // Resume the timer

        axios.post('http://localhost:5000/api/banner', updatedBanner)
            .then(response => {
                console.log('Banner link updated:', response.data.status);
            })
            .catch(error => console.error('Error updating banner link:', error));
    };

    const saveTimer = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const updatedBanner = { ...banner, timer: parseInt(newTimer, 10) };
        setBanner(updatedBanner);
        setTimeRemaining(parseInt(newTimer, 10));
        setEditing(null);
        setIsTimerPaused(false); // Resume the timer

        axios.post('http://localhost:5000/api/banner', updatedBanner)
            .then(response => {
                console.log('Banner timer updated:', response.data.status);
            })
            .catch(error => console.error('Error updating banner timer:', error));
    };

    const startEditing = (type) => {
        setEditing(type);
        setIsTimerPaused(true); // Pause the timer
    };

    const cancelEditing = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setEditing(null);
        setIsTimerPaused(false); // Resume the timer
        // Restore the original values
        setNewDescription(banner.description);
        setNewLink(banner.link);
        setNewTimer(banner.timer);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="relative flex flex-col items-center justify-center bg-gray-100 min-h-screen">
            {banner && banner.isVisible && (
                <div
                    className="bg-gray-900 text-white w-full max-w-6xl mx-auto my-4 p-6 rounded-lg shadow-lg text-center cursor-pointer"
                    style={{ fontSize: banner.description.length > 100 ? '1rem' : '1.25rem' }}
                    onClick={handleBannerClick}
                >
                    <div className="relative">
                        {editing === 'description' ? (
                            <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={newDescription}
                                    onChange={handleDescriptionChange}
                                    className="text-black p-2 rounded-lg border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                                    style={{ width: `${Math.max(newDescription.length + 1, 20)}ch` }}
                                />
                                <div
                                    className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-green-400 hover:bg-green-600 transition-colors"
                                    onClick={saveDescription}
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
                                <h1 className="text-2xl font-bold mb-2 truncate">
                                    {banner.description || 'Banner Description'}
                                </h1>
                                <div
                                    className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-yellow-400 hover:bg-yellow-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing('description');
                                    }}
                                    title="Edit Description"
                                >
                                    <FiEdit3 className="text-white" size={20} />
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="flex items-center justify-center space-x-2 mt-4">
                        <p className="text-md">Remaining Time</p>
                        {editing === 'timer' ? (
                            <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="number"
                                    value={newTimer}
                                    onChange={handleTimerChange}
                                    className="text-black p-2 rounded-lg border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                                    style={{ width: '10ch' }}
                                />
                                <div
                                    className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-green-400 hover:bg-green-600 transition-colors"
                                    onClick={saveTimer}
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
                                <p className="text-md">{formatTime(timeRemaining)}</p>
                                <div
                                    className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-yellow-400 hover:bg-yellow-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing('timer');
                                    }}
                                    title="Edit Timer"
                                >
                                    <FiEdit3 className="text-white" size={20} />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    
                    
                    <div className="flex items-center justify-center space-x-2 mt-4">
                        {editing === 'link' ? (
                            <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={newLink}
                                    onChange={handleLinkChange}
                                    className="text-black p-2 rounded-lg border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                                    style={{ width: `${Math.max(newLink.length + 1, 20)}ch` }}
                                />
                                <div
                                    className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-green-400 hover:bg-green-600 transition-colors"
                                    onClick={saveLink}
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
                                    {banner.link || 'No link provided'}
                                </p>
                                <div
                                    className="flex items-center justify-center cursor-pointer p-1 rounded-full bg-yellow-400 hover:bg-yellow-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing('link');
                                    }}
                                    title="Edit Link"
                                >
                                    <FiEdit3 className="text-white" size={20} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                className="fixed bottom-4 px-6 py-2 text-lg text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors z-20 cursor-pointer"
                onClick={toggleBannerVisibility}
            >
                {banner && banner.isVisible ? 'Hide Banner' : 'Show Banner'}
            </button>
        </div>
    );
};

export default BannerForm;
