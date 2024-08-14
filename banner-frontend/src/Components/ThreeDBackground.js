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
