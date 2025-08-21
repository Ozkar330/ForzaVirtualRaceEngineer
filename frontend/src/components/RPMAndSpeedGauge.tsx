// src/components/RPMAndSpeedGauge.tsx
import React from 'react';
import { CanvasGauge } from './CanvasGauge';
import { SVGGauge } from './SVGGauge';

interface RPMAndSpeedGaugeProps {
  rpmCurrent: number;
  rpmMax: number;
  speed: number;
  gear: number;
  useCanvas?: boolean; // Toggle between Canvas and SVG implementation
}

export const RPMAndSpeedGauge: React.FC<RPMAndSpeedGaugeProps> = ({
  rpmCurrent,
  rpmMax,
  speed,
  gear,
  useCanvas = true // Default to Canvas for best performance
}) => {
  const rpmPercent = Math.min((rpmCurrent / rpmMax) * 100, 100);
  const speedPercent = Math.min((speed / 400) * 100, 100); // máx 400 km/h
  const displayGear = gear === 0 ? 'R' : gear === 11 ? 'N' : gear.toString();

  const GaugeComponent = useCanvas ? CanvasGauge : SVGGauge;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* Gauges */}
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        {/* RPM Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GaugeComponent
            value={rpmPercent}
            maxValue={rpmMax}
            currentValue={Math.round(rpmCurrent)}
            label="RPM"
            color="#FF4F4F"
            size={160}
          />
        </div>

        {/* Speed Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GaugeComponent
            value={speedPercent}
            maxValue={400}
            currentValue={Math.round(speed)}
            label="km/h"
            color="#FFD700"
            size={160}
          />
        </div>
      </div>

      {/* Gear Display */}
      <div style={{
        background: '#333',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        minWidth: '60px',
        textAlign: 'center'
      }}>
        Gear: {displayGear}
      </div>

      {/* Alternative: Keep vertical bars as backup */}
      {/* Uncomment this section if you want to fallback to vertical bars */}
      {/*
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: 120, width: 30, background: '#444', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
            <div
              style={{
                height: `${rpmPercent}%`,
                background: '#FF4F4F',
                width: '100%',
                transition: 'height 0.1s ease-out'
              }}
            />
          </div>
          <span style={{ marginTop: '0.5rem', fontSize: 14, color: 'white' }}>RPM</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: 120, width: 30, background: '#444', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
            <div
              style={{
                height: `${speedPercent}%`,
                background: '#FFD700',
                width: '100%',
                transition: 'height 0.1s ease-out'
              }}
            />
          </div>
          <span style={{ marginTop: '0.5rem', fontSize: 14, color: 'white' }}>Speed</span>
        </div>
      </div>
      */}
    </div>
  );
};