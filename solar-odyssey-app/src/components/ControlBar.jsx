import React from 'react';

export default function ControlBar({ selectedBody, setDestination }) {
  return (
    <div className="control-bar glass-panel" style={{ borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, justifyContent: 'flex-end', paddingRight: '40px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>THROTTLE</span>
        <span style={{ fontSize: '0.7rem' }}>0%</span>
        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-4px', left: '20%', width: '12px', height: '12px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }}></div>
        </div>
        <span style={{ fontSize: '0.7rem' }}>100%</span>
      </div>

      <button 
        className="warp-btn"
        onClick={() => setDestination(selectedBody)}
      >
        ENGAGE WARP DRIVE
        <div style={{ fontSize: '0.5rem', marginTop: '5px', letterSpacing: '1px', opacity: 0.7 }}>CLICK TO ACTIVATE</div>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, paddingLeft: '40px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>AUTOPILOT</span>
        <div style={{ width: '40px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', top: '2px', left: '2px', width: '16px', height: '16px', background: 'var(--text-secondary)', borderRadius: '50%' }}></div>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>OFF</span>
      </div>

    </div>
  );
}
