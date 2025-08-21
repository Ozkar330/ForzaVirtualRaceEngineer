// src/components/SteeringWheelSVG.tsx
import React, { useState } from 'react';

interface SteeringWheelSVGProps {
  angle: number; // entre -1.0 y 1.0
}

export const SteeringWheelSVG: React.FC<SteeringWheelSVGProps> = ({ angle }) => {
  const degrees = Math.round(angle); // escala de -90° a +90°
  const [imageError, setImageError] = useState(false);

  // Fallback steering wheel component
  const FallbackWheel = () => (
    <div style={{
      width: 150,
      height: 150,
      border: '8px solid #2196f3',
      borderRadius: '50%',
      position: 'relative',
      background: '#1e1e1e',
      transform: `rotate(${degrees}deg)`,
      transition: 'transform 0.2s ease-out',
      filter: 'drop-shadow(0 0 3px #000)'
    }}>
      {/* Center hub */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 20,
        height: 20,
        background: 'white',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
      
      {/* Spokes */}
      {[0, 120, 240].map((rotation, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: 60,
            background: 'white',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`
          }}
        />
      ))}
    </div>
  );

  return (
    <div style={{ width: 150, height: 180, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {imageError ? (
        <FallbackWheel />
      ) : (
        <img
          src="./steering_wheel_icon.svg"
          alt="Volante"
          style={{
            width: 150,
            height: 150,
            transform: `rotate(${degrees}deg)`,
            transition: 'transform 0.2s ease-out',
            filter: 'drop-shadow(0 0 3px #000)'
          }}
          onError={() => setImageError(true)}
        />
      )}
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
