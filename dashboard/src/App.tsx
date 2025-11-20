import React, { useEffect, useMemo, useState } from 'react';
import MetricsService, { Measurement } from './metricsService';
import MetricsChart from './components/MetricsChart';

const service = new MetricsService(import.meta.env.VITE_API_BASE ?? 'http://localhost:8000');

function App() {
  const [metrics, setMetrics] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(100);

  const sortedMetrics = useMemo(
    () => [...metrics].sort((a, b) => new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime()),
    [metrics]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await service.list(limit);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('No se pudieron obtener los datos. Verifica que el API esté disponible.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [limit]);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Microdashboard de Potencia</h1>
          <p>Corriente, voltaje y potencia recopiladas desde MySQL.</p>
        </div>
        <div className="control">
          <label htmlFor="limit">N° de muestras</label>
          <input
            id="limit"
            type="number"
            min={10}
            max={1000}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>
      </header>

      {loading && <p>Cargando métricas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          <MetricsChart
            title="Corriente (A)"
            labels={sortedMetrics.map((m) => new Date(m.collected_at).toLocaleTimeString())}
            datasets={[
              { label: 'I1', data: sortedMetrics.map((m) => m.current_1) },
              { label: 'I2', data: sortedMetrics.map((m) => m.current_2) },
              { label: 'I3', data: sortedMetrics.map((m) => m.current_3) }
            ]}
            color="--color-current"
          />
          <MetricsChart
            title="Voltaje (V)"
            labels={sortedMetrics.map((m) => new Date(m.collected_at).toLocaleTimeString())}
            datasets={[
              { label: 'V1', data: sortedMetrics.map((m) => m.voltage_1) },
              { label: 'V2', data: sortedMetrics.map((m) => m.voltage_2) },
              { label: 'V3', data: sortedMetrics.map((m) => m.voltage_3) }
            ]}
            color="--color-voltage"
          />
          <MetricsChart
            title="Potencia (W)"
            labels={sortedMetrics.map((m) => new Date(m.collected_at).toLocaleTimeString())}
            datasets={[
              { label: 'P1', data: sortedMetrics.map((m) => m.power_1) },
              { label: 'P2', data: sortedMetrics.map((m) => m.power_2) },
              { label: 'P3', data: sortedMetrics.map((m) => m.power_3) }
            ]}
            color="--color-power"
          />
        </div>
      )}
    </div>
  );
}

export default App;
