// src/components/LapTable.tsx
import React from 'react';

interface LapTableProps {
  lapNum: number;
  lapTimeCurrent: number;
  lapTimeLast: number;
  lapTimeBest: number;
}

const formatTime = (seconds: number): string => {
  if (seconds === 0 || isNaN(seconds)) return '--:--.---';
  const min = Math.floor(seconds / 60);
  const sec = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${min}:${sec}`;
};

export const LapTable: React.FC<LapTableProps> = ({
  lapNum,
  lapTimeCurrent,
  lapTimeLast,
  lapTimeBest
}) => {
  const delta = lapTimeCurrent && lapTimeBest ? lapTimeCurrent - lapTimeBest : 0;
  const deltaColor = delta < 0 ? '#4CAF50' : delta > 0 ? '#F44336' : '#CCCCCC';
  const deltaSymbol = delta < 0 ? '▲' : delta > 0 ? '▼' : '–';

  return (
    <div
      style={{
        background: '#1e1e1e',
        padding: '1rem',
        borderRadius: 8,
        fontFamily: 'monospace',
        width: 'fit-content'
      }}
    >
      <table style={{ color: 'white', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th>Vuelta</th>
            <th>Actual</th>
            <th>Última</th>
            <th>Mejor</th>
            <th>Δ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{lapNum ?? '-'}</td>
            <td>{formatTime(lapTimeCurrent)}</td>
            <td>{formatTime(lapTimeLast)}</td>
            <td>{formatTime(lapTimeBest)}</td>
            <td style={{ color: deltaColor }}>
              {deltaSymbol} {Math.abs(delta).toFixed(3)}s
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
