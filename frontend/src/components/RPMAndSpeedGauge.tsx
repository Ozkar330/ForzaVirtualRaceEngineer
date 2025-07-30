// src/components/RPMAndSpeedGauge.tsx
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface RPMAndSpeedGaugeProps {
  rpmCurrent: number;
  rpmMax: number;
  speed: number;
  gear: number;
}

export const RPMAndSpeedGauge: React.FC<RPMAndSpeedGaugeProps> = ({
  rpmCurrent,
  rpmMax,
  speed,
  gear,
}) => {
  const rpmPercent = Math.min((rpmCurrent / rpmMax) * 100, 100);
  const speedPercent = Math.min((speed / 400) * 100, 100); // máx 400 km/h
  const displayGear = gear === 0 ? 'N' : gear === -1 ? 'R' : gear.toString();

  const data = [
    { name: 'RPM', value: rpmPercent, fill: '#FF4F4F' },
    { name: 'Speed', value: speedPercent, fill: '#FFD700' }
  ];

  return (
    <div style={{ width: 300, height: 300 }}>
      <RadialBarChart
        width={300}
        height={300}
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        barSize={16}
        data={data}
        startAngle={225}
        endAngle={-45}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background clockWise dataKey="value" />
        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize={28} fontWeight={700} fill="white">
          {Math.round(speed)} km/h
        </text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight={600} fill="white">
          G:{displayGear}
        </text>
      </RadialBarChart>
    </div>
  );
};