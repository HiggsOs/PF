export interface Measurement {
  id: number;
  collected_at: string;
  current_1: number | null;
  current_2: number | null;
  current_3: number | null;
  voltage_1: number | null;
  voltage_2: number | null;
  voltage_3: number | null;
  power_1: number | null;
  power_2: number | null;
  power_3: number | null;
}

class MetricsService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async list(limit = 100): Promise<Measurement[]> {
    const response = await fetch(`${this.baseUrl}/metrics?limit=${limit}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }
}

export default MetricsService;
