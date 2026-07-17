/**
 * Types for the Weather Intelligence App
 */

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  uv_index_max: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationSum: number;
  uvIndex: number;
  windSpeedMax: number;
}

export interface PlanningRecommendation {
  id: string;
  type: "umbrella" | "outdoor" | "temperature" | "uv" | "wind" | "general";
  level: "success" | "info" | "warning" | "danger";
  title: string;
  description: string;
}

export interface WeatherConditionDetails {
  label: string;
  description: string;
  iconName: string;
  bgGradient: string; // Tailwind gradient classes
  themeColor: string; // Primary hex/tailwind color
}
