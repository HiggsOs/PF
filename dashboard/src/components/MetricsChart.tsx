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
  labels: string[];
  datasets: Dataset[];
  color: string;
}

const palette = ['#2196f3', '#f44336', '#4caf50'];

const MetricsChart: React.FC<Props> = ({ title, labels, datasets, color }) => {
  const chartData = {
    labels,
    datasets: datasets.map((dataset, idx) => ({
      ...dataset,
      fill: false,
      borderColor: palette[idx % palette.length],
      backgroundColor: palette[idx % palette.length],
      tension: 0.2,
      spanGaps: true,
      pointRadius: 3
    }))
  };

  return (
    <div className="card" style={{ borderTopColor: `var(${color})` }}>
      <h2>{title}</h2>
      <Line
        options={{
          responsive: true,
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true }
          },
          scales: {
            x: { ticks: { maxRotation: 45, minRotation: 45 } },
            y: { beginAtZero: true }
          }
        }}
        data={chartData}
      />
    </div>
  );
};

export default MetricsChart;
