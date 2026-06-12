import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const IntroSequence = ({ onSkip }) => {
  const containerRef = useRef();
  const text1Ref = useRef();
  const text2Ref = useRef();
  const text3Ref = useRef();
  const text4Ref = useRef();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(text1Ref.current, { opacity: 1, scale: 1.1, duration: 1, ease: "power2.out" }, 0.5)
      .to(text1Ref.current, { opacity: 0, duration: 0.5 }, 2.5);

    tl.to(text2Ref.current, { opacity: 1, scale: 1.1, duration: 1, ease: "power2.out" }, 3)
      .to(text2Ref.current, { opacity: 0, duration: 0.5 }, 5.0);

    tl.to(text3Ref.current, { opacity: 1, scale: 1.1, duration: 1, ease: "power2.out" }, 5.5)
      .to(text3Ref.current, { opacity: 0, duration: 0.5 }, 7.5);

    tl.to(text4Ref.current, { opacity: 1, scale: 1.1, duration: 1, ease: "power2.out" }, 8.5)
      .to(text4Ref.current, { opacity: 0, duration: 1 }, 11.0);

    // Fade out entire container at the end
    tl.to(containerRef.current, { opacity: 0, duration: 1 }, 11.5);

  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        textShadow: '0 0 20px rgba(0, 255, 204, 0.8)'
      }}
    >
      <h1 ref={text1Ref} className="cinematic-text" style={{ opacity: 0, position: 'absolute', color: '#00ffcc', fontSize: '3rem', letterSpacing: '5px' }}>
        HYPER-DRIVE ENGAGED
      </h1>
      <h1 ref={text2Ref} className="cinematic-text" style={{ opacity: 0, position: 'absolute', color: '#ff5500', fontSize: '3.5rem', letterSpacing: '8px' }}>
        ENTERING WORMHOLE
      </h1>
      <h1 ref={text3Ref} className="cinematic-text" style={{ opacity: 0, position: 'absolute', color: '#ffffff', fontSize: '2.5rem', letterSpacing: '4px' }}>
        DESTINATION: SOLAR SYSTEM
      </h1>
      <h1 ref={text4Ref} className="cinematic-text" style={{ opacity: 0, position: 'absolute', color: '#00ffcc', fontSize: '4rem', letterSpacing: '10px' }}>
        WELCOME TO SOLAR ODYSSEY
      </h1>

      <button 
        onClick={onSkip}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          padding: '10px 20px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid #00ffcc',
          color: '#00ffcc',
          cursor: 'pointer',
          pointerEvents: 'auto',
          borderRadius: '5px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(0, 255, 204, 0.2)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
      >
        Skip Intro
      </button>
    </div>
  );
};

export default IntroSequence;
