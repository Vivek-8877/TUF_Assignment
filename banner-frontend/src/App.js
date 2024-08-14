import React from 'react';
import ThreeDBackground from './Components/ThreeDBackground';
import BannerForm from './Components/BannerForm';

function App() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* 3D Background */}
            <ThreeDBackground />

            {/* Main Content */}
            <BannerForm />
        </div>
    );
}

export default App;
