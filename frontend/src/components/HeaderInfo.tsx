// src/components/HeaderInfo.tsx
import React, { useEffect, useState } from 'react';

interface HeaderInfoProps {
  driverName?: string;
  udpConnected: boolean;
  wsConnected: boolean;
  sessionActive: boolean;
  sessionStartTime?: number; // timestamp (ms)
}

export const HeaderInfo: React.FC<HeaderInfoProps> = ({
  driverName = 'Driver',
  udpConnected,
  wsConnected,
  sessionActive,
  sessionStartTime
}) => {
  const [elapsed, setElapsed] = useState('00:00');

  useEffect(() => {
    if (!sessionActive || !sessionStartTime) return;

    const interval = setInterval(() => {
      const delta = Math.floor((Date.now() - sessionStartTime) / 1000);
      const min = Math.floor(delta / 60)
        .toString()
        .padStart(2, '0');
      const sec = (delta % 60).toString().padStart(2, '0');
      setElapsed(`${min}:${sec}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, sessionStartTime]);

  const statusDot = (on: boolean, color: string) => (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: on ? color : '#555',
        marginRight: 6
      }}
    />
  );

  return (
    <div
      style={{
        background: '#1e1e1e',
        padding: '0.5rem 1rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 14,
        fontFamily: 'monospace'
      }}
    >
      <div>👤 {driverName}</div>
      <div>
        {statusDot(udpConnected, '#4CAF50')} UDP
        {'  '}
        {statusDot(wsConnected, '#2196F3')} WebSocket
      </div>
      <div>
        ⏱ {sessionActive ? elapsed : '--:--'}
      </div>
    </div>
  );
};
