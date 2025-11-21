import React, { useEffect, useMemo, useState } from 'react';
import MetricsService, { Measurement } from './metricsService';
import MetricsChart from './components/MetricsChart';

const service = new MetricsService(import.meta.env.VITE_API_BASE ?? 'http://localhost:8000');

const TIMEZONE_OFFSET_MS = 5 * 60 * 60 * 1000;

const formatLocalTime = (isoDate: string) => {
  const utcDate = new Date(isoDate);
  const adjusted = new Date(utcDate.getTime() - TIMEZONE_OFFSET_MS);
  return adjusted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function App() {
  const [metrics, setMetrics] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(100);

  const sortedMetrics = useMemo(
    () => [...metrics].sort((a, b) => new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime()),
    [metrics]
  );

  const labels = useMemo(() => sortedMetrics.map((m) => formatLocalTime(m.collected_at)), [sortedMetrics]);

  const panelFixedPower = useMemo(
    () => sortedMetrics.map((m) => (m.power_3 !== null ? Math.abs(m.power_3) : null)),
    [sortedMetrics]
  );

  const motorsVsFixed = useMemo(
    () => sortedMetrics.map((m, idx) => (m.power_1 !== null ? m.power_1 - (panelFixedPower[idx] ?? 0) : null)),
    [panelFixedPower, sortedMetrics]
  );

  const trackerVsFixed = useMemo(
    () => sortedMetrics.map((m, idx) => (m.power_2 !== null ? m.power_2 - (panelFixedPower[idx] ?? 0) : null)),
    [panelFixedPower, sortedMetrics]
  );

  const latest = sortedMetrics.at(-1);

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
          <p className="eyebrow">Monitoreo solar en vivo</p>
          <h1>Paneles | Motores | Seguidor</h1>
          <p className="muted">Corriente, voltaje y potencia con hora ajustada a GMT-5.</p>
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

      {loading && <p className="muted">Cargando métricas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="highlights">
            <div className="stat">
              <p className="muted">Potencia Motores (P1)</p>
              <h3>{latest?.power_1?.toFixed(2) ?? '--'} W</h3>
              <span className="pill">Motor</span>
            </div>
            <div className="stat">
              <p className="muted">Potencia Seguidor (P2)</p>
              <h3>{latest?.power_2?.toFixed(2) ?? '--'} W</h3>
              <span className="pill">Seguidor</span>
            </div>
            <div className="stat">
              <p className="muted">Potencia Panel Fijo (P3)</p>
              <h3>{latest?.power_3 !== null && latest?.power_3 !== undefined ? Math.abs(latest.power_3).toFixed(2) : '--'} W</h3>
              <span className="pill pill--ghost">Panel fijo</span>
            </div>
            <div className="stat">
              <p className="muted">Última muestra</p>
              <h3>{latest ? formatLocalTime(latest.collected_at) : '--:--'}</h3>
              <span className="pill pill--accent">GMT-5</span>
            </div>
          </section>

          <div className="grid">
            <MetricsChart
              title="Corriente (A)"
              subtitle="Lecturas I1 (Motores), I2 (Seguidor) e I3 (Panel fijo)"
              labels={labels}
              datasets={[
                { label: 'I1 | Motores', data: sortedMetrics.map((m) => m.current_1) },
                { label: 'I2 | Seguidor', data: sortedMetrics.map((m) => m.current_2) },
                { label: 'I3 | Panel fijo', data: sortedMetrics.map((m) => m.current_3) }
              ]}
              color="--color-current"
            />
            <MetricsChart
              title="Voltaje (V)"
              subtitle="Comparación de voltajes en cada fuente"
              labels={labels}
              datasets={[
                { label: 'V1 | Motores', data: sortedMetrics.map((m) => m.voltage_1) },
                { label: 'V2 | Seguidor', data: sortedMetrics.map((m) => m.voltage_2) },
                { label: 'V3 | Panel fijo', data: sortedMetrics.map((m) => m.voltage_3) }
              ]}
              color="--color-voltage"
            />
            <MetricsChart
              title="Potencia (W)"
              subtitle="Potencia instantánea de cada dispositivo"
              labels={labels}
              datasets={[
                { label: 'P1 | Motores', data: sortedMetrics.map((m) => m.power_1) },
                { label: 'P2 | Seguidor', data: sortedMetrics.map((m) => m.power_2) },
                { label: 'P3 | Panel fijo', data: panelFixedPower }
              ]}
              color="--color-power"
            />
            <MetricsChart
              title="Comparativo vs Panel fijo"
              subtitle="Resta de potencia frente al panel fijo"
              labels={labels}
              datasets={[
                { label: 'Motores - Panel fijo', data: motorsVsFixed },
                { label: 'Seguidor - Panel fijo', data: trackerVsFixed }
              ]}
              color="--color-contrast"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
