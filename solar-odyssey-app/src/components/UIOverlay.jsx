import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const UIOverlay = ({ activePlanet, setActivePlanet }) => {
  const planetInfoRef = useRef(null);

  useEffect(() => {
    if (activePlanet) {
      gsap.to(planetInfoRef.current, { opacity: 1, x: 20, duration: 1, ease: 'power3.out' });
    } else {
      gsap.to(planetInfoRef.current, { opacity: 0, x: -20, duration: 0.5 });
    }
  }, [activePlanet]);

  const planets = [
    { id: 'earth', name: 'Earth' },
    { id: 'mars', name: 'Mars' },
    { id: 'jupiter', name: 'Jupiter' },
    { id: 'saturn', name: 'Saturn' },
    { id: 'blackhole', name: 'Black Hole' }
  ];

  return (
    <div className="ui-overlay">
      <div className="planet-info glass-panel" ref={planetInfoRef}>
        <h2 className="cinematic-text">{activePlanet?.toUpperCase()}</h2>
        <p style={{ marginTop: '10px', color: '#ccc' }}>
          {activePlanet === 'mars' && 'Red dust moves across the ground. Mountains are visible. Rovers roam.'}
          {activePlanet === 'saturn' && 'Fly through Saturns rings. Ice particles pass the camera.'}
          {activePlanet === 'jupiter' && 'Landing impossible. Orbital station view. Great Red Spot visible.'}
          {activePlanet === 'blackhole' && 'Space bends around the camera. Time distortion effects.'}
          {!activePlanet && 'Select a destination.'}
        </p>
        <button 
          className="btn-primary" 
          style={{ marginTop: '20px' }}
          onClick={() => setActivePlanet(null)}
        >
          Return to Orbit
        </button>
      </div>

      <div className="planet-selector">
        {planets.map(p => (
          <button 
            key={p.id} 
            className="planet-btn cinematic-text"
            onClick={() => setActivePlanet(p.id)}
            style={{ 
              borderColor: activePlanet === p.id ? '#00ffcc' : 'rgba(255, 255, 255, 0.2)',
              color: activePlanet === p.id ? '#00ffcc' : 'white'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UIOverlay;
