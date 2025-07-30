// src/components/SessionControlPanel.tsx
import React, { useState } from 'react';

interface SessionControlPanelProps {
  onStart?: () => void;
  onStop?: () => void;
  onExport?: () => void;
}

export const SessionControlPanel: React.FC<SessionControlPanelProps> = ({
  onStart,
  onStop,
  onExport
}) => {
  const [active, setActive] = useState(false);

  const handleStart = () => {
    setActive(true);
    onStart?.();
  };

  const handleStop = () => {
    setActive(false);
    onStop?.();
  };

  const handleExport = () => {
    onExport?.();
  };

  return (
    <div
      style={{
        background: '#1e1e1e',
        padding: '1rem',
        borderRadius: 8,
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <button
        onClick={handleStart}
        style={{
          padding: '0.5rem 1rem',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
        disabled={active}
      >
        Iniciar Sesión
      </button>

      <button
        onClick={handleStop}
        style={{
          padding: '0.5rem 1rem',
          background: '#F44336',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
        disabled={!active}
      >
        Detener
      </button>

      <button
        onClick={handleExport}
        style={{
          padding: '0.5rem 1rem',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        Exportar Datos
      </button>
    </div>
  );
};
