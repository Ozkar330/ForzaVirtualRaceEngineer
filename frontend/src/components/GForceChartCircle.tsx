// src/components/GForceChartCircle.tsx
import React, { useEffect, useRef } from 'react';

interface GForceChartCircleProps {
  gLat: number;  // acceleration_x del telemetry
  gLong: number; // acceleration_z del telemetry
}

export const GForceChartCircle: React.FC<GForceChartCircleProps> = ({ gLat, gLong }) => {
  const trailRef = useRef<{ x: number; y: number; opacity: number }[]>([]);
  const animationRef = useRef<number | null>(null);

  // Convertir de m/s² a G (1G = 9.81 m/s²)
  const GRAVITY = 9.81;
  
  // Invertir las fuerzas para representar lo que siente el conductor
  // Al acelerar el auto hacia adelante, el conductor siente fuerza hacia atrás
  const driverGLat = -gLat / GRAVITY;  // Lateral: negativo = izquierda, positivo = derecha
  const driverGLong = -gLong / GRAVITY; // Longitudinal: negativo = atrás, positivo = adelante

  // Límites del medidor (típicamente ±2G para autos deportivos)
  const MAX_G = 2.0;
  const clamp = (value: number) => Math.max(-MAX_G, Math.min(MAX_G, value));
  
  // Aplicar un filtro de suavizado para movimientos más realistas
  const smoothingFactor = 0.15;
  const [smoothedGLat, setSmoothedGLat] = React.useState(0);
  const [smoothedGLong, setSmoothedGLong] = React.useState(0);

  useEffect(() => {
    setSmoothedGLat(prev => prev + (driverGLat - prev) * smoothingFactor);
    setSmoothedGLong(prev => prev + (driverGLong - prev) * smoothingFactor);
  }, [driverGLat, driverGLong]);

  // Añadir efecto de estela para visualizar el historial reciente
  useEffect(() => {
    const animate = () => {
      // Añadir nueva posición a la estela
      if (Math.abs(smoothedGLat) > 0.05 || Math.abs(smoothedGLong) > 0.05) {
        trailRef.current.push({
          x: clamp(smoothedGLat),
          y: clamp(smoothedGLong),
          opacity: 1
        });
      }

      // Limitar el tamaño de la estela y reducir opacidad
      trailRef.current = trailRef.current
        .map(point => ({ ...point, opacity: point.opacity * 0.95 }))
        .filter(point => point.opacity > 0.1)
        .slice(-20);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [smoothedGLat, smoothedGLong]);

  const radius = 70; // Radio del círculo de visualización
  const dotX = clamp(smoothedGLat) * (radius / MAX_G);
  const dotY = -clamp(smoothedGLong) * (radius / MAX_G); // Negativo porque Y crece hacia abajo en SVG

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <svg width="210" height="210" style={{ background: '#1a1a1a', borderRadius: '10px' }}>
        {/* Círculos de referencia */}
        <g transform="translate(105, 105)">
          {/* Círculos de magnitud G */}
          {[0.5, 1, 1.5, 2].map(g => (
            <circle
              key={g}
              cx="0"
              cy="0"
              r={radius * (g / MAX_G)}
              fill="none"
              stroke="#333"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Líneas de referencia */}
          <line x1="-80" y1="0" x2="80" y2="0" stroke="#444" strokeWidth="1" />
          <line x1="0" y1="-80" x2="0" y2="80" stroke="#444" strokeWidth="1" />
          
          {/* Etiquetas */}
          <text x="0" y="-85" textAnchor="middle" fill="#666" fontSize="12">
            Frenado
          </text>
          <text x="0" y="95" textAnchor="middle" fill="#666" fontSize="12">
            Aceleración
          </text>
          <text x="-85" y="5" textAnchor="middle" fill="#666" fontSize="12">
            Izq
          </text>
          <text x="85" y="5" textAnchor="middle" fill="#666" fontSize="12">
            Der
          </text>
          
          {/* Marcadores de G */}
          <text x="35" y="-5" fill="#555" fontSize="10">1G</text>
          <text x="70" y="-5" fill="#555" fontSize="10">2G</text>
          
          {/* Estela de movimiento */}
          {trailRef.current.map((point, i) => (
            <circle
              key={i}
              cx={point.x * (radius / MAX_G)}
              cy={-point.y * (radius / MAX_G)}
              r="2"
              fill="#FF9800"
              opacity={point.opacity * 0.3}
            />
          ))}
          
          {/* Punto actual */}
          <circle
            cx={dotX}
            cy={dotY}
            r="6"
            fill="#FF9800"
            stroke="#FFF"
            strokeWidth="2"
          />
          
          {/* Centro de referencia */}
          <circle cx="0" cy="0" r="3" fill="#666" />
        </g>
      </svg>
      
      {/* Valores numéricos */}
      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '14px',
        color: '#AAA'
      }}>
        <span>Lateral: {smoothedGLat.toFixed(2)}G</span>
        <span>Long: {smoothedGLong.toFixed(2)}G</span>
      </div>
      
      {/* Barra de magnitud total */}
      <div style={{
        width: '160px',
        height: '8px',
        background: '#333',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(100, (Math.sqrt(smoothedGLat**2 + smoothedGLong**2) / MAX_G) * 100)}%`,
          height: '100%',
          background: `linear-gradient(90deg, #4CAF50 0%, #FF9800 50%, #F44336 100%)`,
          transition: 'width 0.1s ease-out'
        }} />
      </div>
    </div>
  );
};