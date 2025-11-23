export interface WeatherData {
  location: string;
  current: {
    temp_c: number;
    condition: string;
    humidity: number;
    wind_kph: number;
    feels_like_c: number;
    uv_index: number;
    description: string;
  };
  forecast: Array<{
    time: string;
    temp_c: number;
    condition: string;
  }>;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface WeatherResponse {
  data: WeatherData | null;
  sources: GroundingSource[];
  error?: string;
}
