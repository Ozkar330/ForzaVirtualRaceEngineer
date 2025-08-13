// src/components/Dashboard.tsx
import React from 'react';
import { RPMAndSpeedGauge } from './RPMAndSpeedGauge';
import { SteeringWheelSVG } from './SteeringWheelSVG';
import { LapTable } from './LapTable';
import { ThrottleBrakeMeter } from './ThrottleBrakeMeter';
import { GForceChartCircle } from './GForceChartCircle';
import { SessionControlPanel } from './SessionControlPanel';

interface DashboardProps {
  telemetry: any;
  onStart: () => void;
  onStop: () => void;
  onExport: () => void;
  sessionActive: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  telemetry,
  onStart,
  onStop,
  onExport,
  // sessionActive
}) => {
  if (!telemetry) return <div style={{ padding: '2rem', color: 'white', fontSize: '18px' }}>Esperando datos…</div>;

  return (
    <div style={{ padding: '2rem' }}>
      {/* Panel de sesión arriba */}
      <div style={{ marginBottom: '1rem' }}>
        <SessionControlPanel
          onStart={onStart}
          onStop={onStop}
          onExport={onExport}
        />
      </div>

      {/* Fila principal: GForce - RPM - LapTable */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '4rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h3 style={{ color: 'white', textAlign: 'center' }}>Fuerzas G</h3>
          <GForceChartCircle
            gLat={telemetry.acceleration_x}
            gLong={telemetry.acceleration_z}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'white' }}>RPM + Velocidad</h3>
          <RPMAndSpeedGauge
            rpmCurrent={telemetry.engine_current_rpm}
            rpmMax={telemetry.engine_max_rpm}
            speed={telemetry.speed}
            gear={telemetry.gear_num}
          />
        </div>

        <div>
          <h3 style={{ color: 'white', textAlign: 'center' }}>Tiempos de Vuelta</h3>
          <LapTable
            lapNum={telemetry.lap_num}
            lapTimeCurrent={telemetry.lap_time_current}
            lapTimeLast={telemetry.lap_time_last}
            lapTimeBest={telemetry.lap_time_best}
          />
        </div>
      </div>

      {/* Sección inferior: inputs, volante y vuelta/posición */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          alignItems: 'flex-end'
        }}
      >
        <div>
          <h3 style={{ color: 'white', textAlign: 'center' }}>Inputs</h3>
          <ThrottleBrakeMeter
            throttle={telemetry.throttle}
            brake={telemetry.brake}
          />
        </div>

        <div>
          <h3 style={{ color: 'white', textAlign: 'center' }}>Volante</h3>
          <SteeringWheelSVG angle={telemetry.steering_angle} />
        </div>

        <div>
          <h3 style={{ color: 'white', textAlign: 'center' }}>Vuelta / Posición</h3>
          <div style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            Vuelta: {telemetry.lap_num ?? '-'}<br />
            Posición: {telemetry.race_position ?? '-'}
          </div>
        </div>
      </div>
    </div>
  );
};