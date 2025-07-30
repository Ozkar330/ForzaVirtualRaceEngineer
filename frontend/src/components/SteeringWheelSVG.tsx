// src/components/SteeringWheelSVG.tsx
import React from 'react';

interface SteeringWheelSVGProps {
  angle: number; // entre -1.0 y 1.0
}

export const SteeringWheelSVG: React.FC<SteeringWheelSVGProps> = ({ angle }) => {
  const degrees = Math.round(angle); // escala de -90° a +90°

  return (
    <div style={{ width: 150, height: 180, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src="/steering_wheel_icon.svg"
        alt="Volante"
        style={{
          width: 150,
          height: 150,
          transform: `rotate(${degrees}deg)`,
          transition: 'transform 0.2s ease-out',
          filter: 'drop-shadow(0 0 3px #000)'
        }}
      />
      {/* Texto debajo */}
      <div
        style={{
          marginTop: '0.25rem',
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
          fontFamily: 'monospace'
        }}
      >
        {degrees}°
      </div>
    </div>
  );
};
