// src/components/ThrottleBrakeMeter.tsx
import React from 'react';

interface ThrottleBrakeMeterProps {
  throttle: number; // porcentaje 0 a 100
  brake: number;    // porcentaje 0 a 100
}

export const ThrottleBrakeMeter: React.FC<ThrottleBrakeMeterProps> = ({ throttle, brake }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Throttle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: 120, width: 30, background: '#444', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
            <div
              style={{
                height: `${throttle}%`,
                background: '#4CAF50',
                width: '100%',
                transition: 'height 0.2s ease-out'
              }}
            />
          </div>
          <span style={{ marginTop: '0.5rem', fontSize: 14 }}>Throttle</span>
        </div>

        {/* Brake */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: 120, width: 30, background: '#444', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
            <div
              style={{
                height: `${brake}%`,
                background: '#F44336',
                width: '100%',
                transition: 'height 0.2s ease-out'
              }}
            />
          </div>
          <span style={{ marginTop: '0.5rem', fontSize: 14 }}>Brake</span>
        </div>
      </div>
    </div>
  );
};
