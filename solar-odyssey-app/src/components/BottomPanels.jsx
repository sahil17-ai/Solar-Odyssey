import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BottomPanels({ selectedBody, destination }) {
  const aiWavesRef = useRef([]);

  useEffect(() => {
    aiWavesRef.current.forEach((wave, i) => {
      gsap.to(wave, {
        height: 'random(5, 25)',
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        delay: i * 0.05,
        ease: 'sine.inOut'
      });
    });
  }, []);

  const getBodyInfo = (body) => {
    switch (body) {
      case 'Sun': return { type: 'G2V Star', temp: '5,505 °C', desc: 'The Heart of Our Solar System' };
      case 'Mercury': return { type: 'Terrestrial', temp: '430 °C', desc: 'Closest planet to the Sun' };
      case 'Venus': return { type: 'Terrestrial', temp: '471 °C', desc: 'Hottest planet in the Solar System' };
      case 'Earth': return { type: 'Terrestrial', temp: '15 °C', desc: 'Our home planet' };
      case 'Mars': return { type: 'Terrestrial', temp: '-65 °C', desc: 'The Red Planet' };
      case 'Jupiter': return { type: 'Gas Giant', temp: '-110 °C', desc: 'Largest planet in the Solar System' };
      case 'Saturn': return { type: 'Gas Giant', temp: '-140 °C', desc: 'Known for its prominent ring system' };
      case 'Uranus': return { type: 'Ice Giant', temp: '-195 °C', desc: 'Rotates on its side' };
      case 'Neptune': return { type: 'Ice Giant', temp: '-200 °C', desc: 'Windiest planet' };
      default: return { type: 'Unknown', temp: 'Unknown', desc: 'Celestial Body' };
    }
  };

  const info = getBodyInfo(selectedBody);

  return (
    <div className="popup-panels">
      {/* Selected Body Info */}
      <div className="info-card glass-panel popup-anim">
        <h3 style={{ textTransform: 'uppercase', color: '#00ffcc', letterSpacing: '2px', marginBottom: '5px' }}>{selectedBody}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>{info.desc}</p>
        
        <div className="stat-row"><span className="stat-label">Type</span><span>{info.type}</span></div>
        <div className="stat-row"><span className="stat-label">Surface Temp.</span><span>{info.temp}</span></div>
      </div>

      {/* AI Assistant */}
      <div className="info-card glass-panel popup-anim" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="card-title">AI ASSISTANT</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', zIndex: 2, position: 'relative', maxWidth: '70%' }}>
          Analyzing {selectedBody}. {info.desc}.
        </p>
        
        <div style={{ position: 'absolute', right: '-20px', top: '20px', width: '120px', height: '150px', background: 'radial-gradient(circle, rgba(0,255,204,0.2) 0%, transparent 70%)', zIndex: 1 }}></div>
        
        <div style={{ display: 'flex', gap: '3px', position: 'absolute', bottom: '20px', left: '20px', alignItems: 'center', height: '30px' }}>
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              ref={el => aiWavesRef.current[i] = el}
              style={{ width: '2px', background: 'var(--accent)', borderRadius: '2px', height: '5px' }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
