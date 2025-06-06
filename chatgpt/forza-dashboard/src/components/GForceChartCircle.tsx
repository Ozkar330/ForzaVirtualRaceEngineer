// src/components/GForceChartCircle.tsx
import React from 'react';

interface GForceChartCircleProps {
  gLat: number;
  gLong: number;
}

export const GForceChartCircle: React.FC<GForceChartCircleProps> = ({ gLat, gLong }) => {
  const clamp = (value: number) => Math.max(-1.5, Math.min(1.5, value));

  return (
    <div style={{
      width: 150,
      height: 150,
      borderRadius: '50%',
      border: '2px solid #FFF',
      position: 'relative',
      background: '#1e1e1e'
    }}>
      <div style={{
        position: 'absolute',
        left: `calc(50% + ${clamp(gLat) * 40}px)`,
        top: `calc(50% - ${clamp(gLong) * 40}px)`,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FF9800',
        transform: 'translate(-50%, -50%)'
      }} />
    </div>
  );
};