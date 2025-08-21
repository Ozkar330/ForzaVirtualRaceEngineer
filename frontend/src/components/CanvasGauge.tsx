// src/components/CanvasGauge.tsx
import React, { useRef, useEffect } from 'react';

interface CanvasGaugeProps {
  value: number; // 0-100 percentage
  maxValue: number;
  currentValue: number;
  label: string;
  color: string;
  size?: number;
}

export const CanvasGauge: React.FC<CanvasGaugeProps> = ({
  value,
  maxValue,
  currentValue,
  label,
  color,
  size = 150
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    const lineWidth = size * 0.08;

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Value arc
    const angle = 0.75 * Math.PI + (value / 100) * 1.5 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.12}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(currentValue.toString(), centerX, centerY - size * 0.05);
    
    ctx.font = `${size * 0.08}px Arial`;
    ctx.fillText(label, centerX, centerY + size * 0.08);

  }, [value, currentValue, label, color, size]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      style={{ display: 'block' }}
    />
  );
};