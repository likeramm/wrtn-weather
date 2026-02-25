export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    visibility: number;
    uvi?: number;
    clouds: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  pop: number;
}

export interface DailyForecast {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  humidity: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  pop: number;
}

export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface SearchHistory {
  name: string;
  lat: number;
  lon: number;
  country: string;
  timestamp: number;
}

export interface FavoriteLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
}
