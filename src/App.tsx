import React, { useState, useEffect } from "react";
import { 
  CloudSun, 
  MapPin, 
  Thermometer, 
  RefreshCw, 
  Info,
  Calendar,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { GeocodingResult, WeatherResponse, DailyForecast, PlanningRecommendation } from "./types";
import CitySearch from "./components/CitySearch";
import WeatherDetails from "./components/WeatherDetails";
import WeatherForecast from "./components/WeatherForecast";
import WeatherRecommendations from "./components/WeatherRecommendations";
import { generateRecommendations, getWeatherCondition, formatForecastDate } from "./utils/weatherUtils";

const DEFAULT_CITY: GeocodingResult = {
  id: 5128581,
  name: "New York",
  latitude: 40.7128,
  longitude: -74.0060,
  country: "United States",
  admin1: "New York",
  country_code: "US"
};

export default function App() {
  const [activeCity, setActiveCity] = useState<GeocodingResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [forecastList, setForecastList] = useState<DailyForecast[]>([]);
  const [recommendations, setRecommendations] = useState<PlanningRecommendation[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load preferences and cached city from localStorage on mount
  useEffect(() => {
    // Unit preference
    const savedUnit = localStorage.getItem("weather_intelligence_unit");
    if (savedUnit === "metric" || savedUnit === "imperial") {
      setUnit(savedUnit);
    }

    // Last searched city preference
    const savedCity = localStorage.getItem("weather_intelligence_last_city");
    if (savedCity) {
      try {
        const parsed = JSON.parse(savedCity);
        if (parsed && parsed.latitude && parsed.longitude) {
          setActiveCity(parsed);
        }
      } catch (e) {
        console.error("Failed to parse cached city", e);
      }
    }
  }, []);

  // Fetch weather data whenever activeCity changes
  useEffect(() => {
    if (activeCity) {
      fetchWeather(activeCity);
    }
  }, [activeCity]);

  const fetchWeather = async (city: GeocodingResult) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,wind_speed_10m_max&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Unable to fetch weather details for this location.");
      }
      
      const data: WeatherResponse = await res.json();
      setWeatherData(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      // Map daily raw arrays into tidy DailyForecast interface items
      if (data.daily && data.daily.time) {
        const mapped: DailyForecast[] = data.daily.time.map((timeStr, idx) => {
          const { dayName, formattedDate } = formatForecastDate(timeStr, idx);
          return {
            date: formattedDate,
            dayName: dayName,
            weatherCode: data.daily.weather_code[idx],
            tempMax: data.daily.temperature_2m_max[idx],
            tempMin: data.daily.temperature_2m_min[idx],
            apparentMax: data.daily.apparent_temperature_max[idx],
            apparentMin: data.daily.apparent_temperature_min[idx],
            precipitationSum: data.daily.precipitation_sum[idx] || 0,
            uvIndex: data.daily.uv_index_max[idx] || 0,
            windSpeedMax: data.daily.wind_speed_10m_max[idx] || 0,
          };
        });
        
        setForecastList(mapped);

        // Generate planning recommendations based on current metrics and daily outlooks
        if (data.current) {
          const recs = generateRecommendations(data.current, mapped);
          setRecommendations(recs);
        }
      }

      // Save city to cache
      localStorage.setItem("weather_intelligence_last_city", JSON.stringify(city));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to retrieve local weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCity = (city: GeocodingResult) => {
    setActiveCity(city);
  };

  const toggleUnit = () => {
    const nextUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(nextUnit);
    localStorage.setItem("weather_intelligence_unit", nextUnit);
  };

  // Get active weather condition details for dynamic styling
  const condition = weatherData && weatherData.current 
    ? getWeatherCondition(weatherData.current.weather_code, weatherData.current.is_day)
    : null;

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-500 pb-16">
      
      {/* Dynamic ambient header glow that matches the current weather's styling color */}
      <div 
        className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${condition ? condition.bgGradient : "from-blue-500/10"} opacity-15 blur-3xl pointer-events-none transition-all duration-700`}
      ></div>

      {/* Primary Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        
        {/* Upper Navigation / Title Block */}
        <header id="app-main-header" className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-500/15">
              <CloudSun size={26} className="animate-pulse" />
            </div>
            <div>
              <h1 id="app-branding-title" className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900">
                Weather Intelligence
              </h1>
              <p className="text-xs text-slate-500 font-medium">Data-Driven Smart Planning Assistant</p>
            </div>
          </div>

          {/* Unit Toggle & Refresh block */}
          <div className="flex items-center gap-3">
            
            {/* Last updated indicator */}
            {lastUpdated && (
              <span id="last-updated-badge" className="text-[11px] font-mono text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Updated {lastUpdated}
              </span>
            )}

            {/* Quick manual refresh */}
            <button
              id="manual-refresh-button"
              onClick={() => fetchWeather(activeCity)}
              disabled={isLoading}
              title="Refresh Forecast Data"
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin text-blue-500" : ""} />
            </button>

            {/* Metric/Imperial Switcher Slider button */}
            <button
              id="unit-toggle-slider"
              onClick={toggleUnit}
              className="p-1 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/50 flex items-center gap-1 cursor-pointer transition-all relative"
            >
              <div 
                className={`absolute h-7 w-12 bg-white rounded-xl shadow-xs transition-transform duration-300 ${unit === "imperial" ? "transform translate-x-12" : "transform translate-x-0"}`}
              ></div>
              <span className={`text-[11px] font-bold z-10 px-3.5 py-1.5 select-none transition-colors ${unit === "metric" ? "text-blue-600" : "text-slate-500"}`}>
                °C
              </span>
              <span className={`text-[11px] font-bold z-10 px-3.5 py-1.5 select-none transition-colors ${unit === "imperial" ? "text-blue-600" : "text-slate-500"}`}>
                °F
              </span>
            </button>

          </div>
        </header>

        {/* Dynamic Search Box */}
        <CitySearch onSelectCity={handleSelectCity} isLoading={isLoading} currentCityName={activeCity.name} />

        {/* Error message panel */}
        {errorMsg && (
          <div id="error-alert-banner" className="w-full max-w-2xl mx-auto mb-8 bg-rose-50 border border-rose-100 text-rose-950 p-4 rounded-2xl flex items-start gap-3 animate-fade-in-up">
            <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-bold text-sm">Location Lookup Failed</h4>
              <p className="text-xs text-rose-700 mt-1">{errorMsg}</p>
              <button 
                id="retry-search-button"
                onClick={() => fetchWeather(activeCity)}
                className="text-xs font-semibold underline text-rose-800 hover:text-rose-950 mt-2 block"
              >
                Attempt connection retry
              </button>
            </div>
          </div>
        )}

        {/* Main Weather Information Panel */}
        {isLoading && !weatherData ? (
          /* Loading Skeleton */
          <div id="loading-skeletons" className="space-y-8 animate-pulse">
            {/* Details skeleton */}
            <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
            {/* Recommendation skeleton */}
            <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
            {/* Forecast cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : (
          weatherData && weatherData.current && (
            <div id="weather-dashboard-main" className="space-y-8">
              
              {/* Detailed Current Weather Component */}
              <WeatherDetails 
                cityName={activeCity.name}
                country={activeCity.country}
                admin1={activeCity.admin1}
                current={weatherData.current}
                unit={unit}
              />

              {/* Dynamic Planning Recommendations */}
              <WeatherRecommendations recommendations={recommendations} />

              {/* 7-Day Forecast Component */}
              <WeatherForecast forecasts={forecastList} unit={unit} />

            </div>
          )
        )}

        {/* Footer info block */}
        <footer id="app-footer-bar" className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-1 text-xs">
            <Info size={12} />
            <span>Weather forecasts supplied instantly via free, open-source <strong>Open-Meteo APIs</strong>.</span>
          </div>
          <p className="text-[10px] font-mono">
            Weather Intelligence App • Latitude: {activeCity.latitude.toFixed(4)}° • Longitude: {activeCity.longitude.toFixed(4)}°
          </p>
        </footer>

      </div>
    </div>
  );
}
