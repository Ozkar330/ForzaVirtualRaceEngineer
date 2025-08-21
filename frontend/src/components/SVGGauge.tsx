// src/components/SVGGauge.tsx
import React from 'react';

interface SVGGaugeProps {
  value: number; // 0-100 percentage
  maxValue: number;
  currentValue: number;
  label: string;
  color: string;
  size?: number;
}

export const SVGGauge: React.FC<SVGGaugeProps> = ({
  value,
  maxValue,
  currentValue,
  label,
  color,
  size = 150
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#333"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={circumference * 0.25} // Start from 3/4 position
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset + circumference * 0.25}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 0.1s ease-out'
          }}
        />
      </svg>
      
      {/* Center text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: size * 0.12, fontWeight: 'bold' }}>
          {currentValue}
        </div>
        <div style={{ fontSize: size * 0.08 }}>
          {label}
        </div>
      </div>
    </div>
  );
};