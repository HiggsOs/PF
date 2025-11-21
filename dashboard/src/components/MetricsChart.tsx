import React from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Dataset {
  label: string;
  data: Array<number | null>;
}

interface Props {
  title: string;
  subtitle?: string;
  labels: string[];
  datasets: Dataset[];
  color: string;
}

const palette = ['#2196f3', '#f44336', '#4caf50'];

const MetricsChart: React.FC<Props> = ({ title, subtitle, labels, datasets, color }) => {
  const chartData = {
    labels,
    datasets: datasets.map((dataset, idx) => ({
      ...dataset,
      fill: true,
      borderColor: palette[idx % palette.length],
      backgroundColor: `${palette[idx % palette.length]}26`,
      tension: 0.4,
      spanGaps: true,
      pointRadius: 0,
      borderWidth: 2,
      pointHitRadius: 10
    }))
  };

  return (
    <div className="card" style={{ borderTopColor: `var(${color})` }}>
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
      <Line
        options={{
          responsive: true,
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { color: '#e5e7eb', boxWidth: 12 } },
            tooltip: { enabled: true }
          },
          scales: {
            x: {
              ticks: { maxRotation: 45, minRotation: 45, color: '#cbd5e1' },
              grid: { color: 'rgba(255,255,255,0.06)' }
            },
            y: { beginAtZero: true, ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.06)' } }
          }
        }}
        data={chartData}
      />
    </div>
  );
};

export default MetricsChart;
