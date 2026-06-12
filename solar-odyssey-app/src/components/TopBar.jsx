import React, { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toISOString().substr(11, 8); // HH:MM:SS
  };

  return (
    <div className="topbar glass-panel" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}>
      <div className="mission-time">
        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '2px' }}>MISSION TIME</div>
        <h2>{formatTime(time)}</h2>
        <p>UTC {time.toISOString().substr(0, 10)} {formatTime(time)}</p>
      </div>

      <div className="top-actions">
        <button className="action-btn">
          <div style={{ width: '20px', height: '20px', border: '1px solid currentColor', borderRadius: '4px' }}></div>
          Cockpit View
        </button>
        <button className="action-btn" style={{ color: 'var(--accent)' }}>
          <div style={{ width: '20px', height: '20px', border: '1px solid currentColor', borderRadius: '50%' }}></div>
          Solar Map
        </button>
        <button className="action-btn">
          <div style={{ width: '20px', height: '2px', background: 'currentColor', margin: '9px 0' }}></div>
          Mission Log
        </button>
        <button className="action-btn">
          <div style={{ width: '10px', height: '10px', background: 'currentColor', borderRadius: '50%', margin: '5px' }}></div>
          AI Assistant
        </button>
        <button className="action-btn">
          <div style={{ width: '16px', height: '16px', border: '2px dotted currentColor', borderRadius: '50%' }}></div>
          Settings
        </button>
      </div>

      <div className="systems-status">
        <h3>SYSTEMS NOMINAL</h3>
        <p>ALL SYSTEMS OPERATIONAL</p>
      </div>
    </div>
  );
}
