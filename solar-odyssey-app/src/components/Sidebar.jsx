import React from 'react';

const navData = [
  { name: 'Sun', color: '#ffcc00' },
  { name: 'Mercury', color: '#8c8c8c' },
  { name: 'Venus', color: '#e3bb76' },
  { name: 'Earth', color: '#2b82c9', moons: ['Moon'] },
  { name: 'Mars', color: '#c1440e', moons: ['Phobos', 'Deimos'] },
  { name: 'Jupiter', color: '#e3dccb', moons: ['Io', 'Europa', 'Ganymede', 'Callisto'] },
  { name: 'Saturn', color: '#ead6b8', moons: ['Titan'] },
  { name: 'Uranus', color: '#d1e7e7' },
  { name: 'Neptune', color: '#5b5ddf', moons: ['Triton'] },
  { name: 'Pluto (Dwarf Planet)', color: '#dddddd' },
  { name: 'Asteroid Belt', color: '#888888' },
  { name: 'Ceres (Dwarf Planet)', color: '#aaaaaa' },
  { name: 'Black Hole', color: '#ff00ff' }
];

export default function Sidebar({ selectedBody, setSelectedBody, audioMuted, setAudioMuted, isFlightMode, setIsFlightMode, isMarsLanding, setIsMarsLanding }) {
  if (isMarsLanding) return null;

  return (
    <div className="sidebar">
      <div className="brand" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem', letterSpacing: '2px', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
          SOLAR<span style={{ color: 'var(--accent)' }}>ODYSSEY</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '5px 0 0 0' }}>AI EXPLORATION TERMINAL</p>
      </div>

      <button 
        className={`action-btn ${!selectedBody && !isFlightMode ? 'active-glow' : ''}`}
        onClick={() => { setSelectedBody(null); setIsFlightMode(false); }}
        style={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}
      >
        🌌 SOLAR SYSTEM VIEW
      </button>

      <button 
        className={`action-btn ${isFlightMode ? 'active-glow' : ''}`}
        onClick={() => setIsFlightMode(!isFlightMode)}
        style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', background: isFlightMode ? 'rgba(0,255,204,0.2)' : '' }}
      >
        🚀 {isFlightMode ? 'DISABLE FLIGHT MODE' : 'ENABLE FLIGHT MODE'}
      </button>

      {selectedBody === 'Mars' && (
        <button 
          className="action-btn active-glow"
          onClick={() => setIsMarsLanding(true)}
          style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', background: 'rgba(255,68,34,0.3)', borderColor: '#ff4422', color: '#ff4422' }}
        >
          🔴 LAND ON MARS
        </button>
      )}

      <div className="nav-section">
        <div className="nav-title">SOLAR SYSTEM NAVIGATION</div>
        {navData.map((item) => (
          <div key={item.name} className="nav-item">
            <div 
              className={`nav-link ${selectedBody === item.name ? 'active' : ''}`}
              onClick={() => setSelectedBody(item.name)}
            >
              <div className="planet-icon" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}></div>
              <span>{item.name}</span>
            </div>
            {item.moons && item.moons.map(moon => (
              <div 
                key={moon} 
                className={`nav-sublink ${selectedBody === moon ? 'active' : ''}`}
                onClick={() => setSelectedBody(moon)}
              >
                <div style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }}></div>
                <span>{moon}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="nav-section" style={{ marginTop: '20px' }}>
        <div className="nav-title" style={{ color: '#ff4422' }}>BEYOND SOLAR SYSTEM</div>
        <ul className="body-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['Kepler-186', 'Kepler-186b', 'Kepler-186f'].map(body => (
            <li 
              key={body}
              className={selectedBody === body ? 'active' : ''}
              onClick={() => setSelectedBody(body)}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: body === 'Kepler-186' ? '#ff4422' : '#00cc66' }}></div>
              <span>{body} {body === 'Kepler-186f' ? '(Habitable)' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          className="action-btn" 
          onClick={() => setAudioMuted(!audioMuted)}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}
        >
          {audioMuted ? '🔈 MUSIC OFF' : '🔊 MUSIC ON'}
        </button>
      </div>
    </div>
  );
}
