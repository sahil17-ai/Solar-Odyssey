import React from 'react';

export default function TimeControl({ timeScale, setTimeScale }) {
  return (
    <div className="time-control glass-panel" style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '400px',
      padding: '15px 30px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>
        <span>PAST</span>
        <span style={{ color: timeScale !== 1 ? '#00ffcc' : 'white', fontWeight: 'bold' }}>
          TIME SIMULATOR: {timeScale.toFixed(1)}x
        </span>
        <span>FUTURE</span>
      </div>
      <input 
        type="range" 
        min="-50" 
        max="50" 
        step="0.1" 
        value={timeScale}
        onChange={(e) => setTimeScale(parseFloat(e.target.value))}
        style={{ width: '100%', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
        <button onClick={() => setTimeScale(1)} className="action-btn" style={{ padding: '5px 15px', fontSize: '0.7rem' }}>RESET</button>
        <button onClick={() => setTimeScale(0)} className="action-btn" style={{ padding: '5px 15px', fontSize: '0.7rem' }}>PAUSE</button>
      </div>
    </div>
  );
}
