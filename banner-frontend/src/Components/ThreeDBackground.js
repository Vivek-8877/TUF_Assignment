import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const ThreeDBackground = () => {
    const vantaRef = useRef(null);
    const vantaEffect = useRef(null);


useEffect(() => {
    if (vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = NET({
            el: vantaRef.current,
            // mouseControls: true,
            // touchControls: true,
            // gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            points: 17.00,
            maxDistance: 22.00,
            spacing: 14.00,
            THREE: THREE,
            color: 0x0077ff,
            backgroundColor: 0x000000,
        });
    }
    return () => {
        if (vantaEffect.current) {
            vantaEffect.current.destroy();
        }
    };
}, [vantaRef]);


    return (
        <div
            ref={vantaRef}
            style={{
                width: '100%',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
            }}
        />
    );
};

export default ThreeDBackground;
