import React from "react";
import * as Icons from "lucide-react";
import { CurrentWeatherData, WeatherConditionDetails } from "../types";
import { getWeatherCondition } from "../utils/weatherUtils";

interface WeatherDetailsProps {
  cityName: string;
  country: string;
  admin1?: string;
  current: CurrentWeatherData;
  unit: "metric" | "imperial";
}

// Helper to dynamically render Lucide icons by name
export function WeatherIcon({ name, className, size = 24 }: { name: string; className?: string; size?: number }) {
  const IconComponent = (Icons as any)[name] || Icons.Cloud;
  return <IconComponent className={className} size={size} />;
}

export default function WeatherDetails({ cityName, country, admin1, current, unit }: WeatherDetailsProps) {
  const condition: WeatherConditionDetails = getWeatherCondition(current.weather_code, current.is_day);

  // Convert unit calculations
  const isMetric = unit === "metric";
  const temp = isMetric ? current.temperature_2m : (current.temperature_2m * 9) / 5 + 32;
  const apparentTemp = isMetric ? current.apparent_temperature : (current.apparent_temperature * 9) / 5 + 32;
  const windSpeed = isMetric ? current.wind_speed_10m : current.wind_speed_10m * 0.621371;

  const tempUnit = isMetric ? "°C" : "°F";
  const windUnit = isMetric ? "km/h" : "mph";

  // Precipitation display helper
  const precipitation = current.precipitation;
  const hasPrecipitation = precipitation > 0;

  return (
    <div 
      id="weather-details-card" 
      className={`w-full rounded-3xl p-6 md:p-8 bg-gradient-to-br ${condition.bgGradient} shadow-2xl relative overflow-hidden transition-all duration-500`}
    >
      {/* Decorative ambient background blur circle */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* City Location and Header info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase opacity-85">
            <Icons.MapPin size={14} />
            <span>Current Weather</span>
          </div>
          <h1 id="details-city-name" className="text-3xl md:text-4xl font-bold font-display tracking-tight mt-1">
            {cityName}
          </h1>
          <p id="details-country-name" className="text-sm opacity-80 mt-0.5 font-medium">
            {admin1 ? `${admin1}, ` : ""}{country}
          </p>
        </div>

        {/* Big Condition status pill */}
        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 self-start">
          <WeatherIcon name={condition.iconName} className="animate-pulse" size={28} />
          <div>
            <div id="details-condition-label" className="font-bold text-sm leading-none">{condition.label}</div>
            <div id="details-condition-desc" className="text-[11px] opacity-80 mt-0.5 leading-none font-medium">{condition.description}</div>
          </div>
        </div>
      </div>

      {/* Hero Temperature Layout */}
      <div className="relative z-10 my-8 flex flex-col sm:flex-row items-baseline sm:items-center gap-4 sm:gap-8">
        <div className="flex items-start">
          <span id="details-current-temp" className="text-7xl sm:text-8xl font-extrabold font-display tracking-tighter leading-none">
            {Math.round(temp)}
          </span>
          <span className="text-3xl sm:text-4xl font-bold font-display ml-0.5">{tempUnit}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-medium opacity-90">
            <Icons.Thermometer size={16} />
            <span>Feels like <strong id="details-feels-temp" className="font-bold">{Math.round(apparentTemp)}{tempUnit}</strong></span>
          </div>
          <p className="text-xs opacity-75 max-w-sm">
            Winds are blowing at {Math.round(windSpeed)} {windUnit}. {precipitation > 0 ? `${precipitation}mm of rainfall detected.` : "No rain observed today."}
          </p>
        </div>
      </div>

      {/* Grid of Weather parameters */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        
        {/* Humidity */}
        <div id="metric-humidity" className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300">
          <div className="flex items-center justify-between text-white/70 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Humidity</span>
            <Icons.Droplets size={18} className="text-sky-200" />
          </div>
          <div id="metric-humidity-val" className="text-2xl font-bold font-display">{current.relative_humidity_2m}%</div>
          <p className="text-[10px] text-white/70 mt-1">Water vapor levels</p>
        </div>

        {/* Wind */}
        <div id="metric-wind" className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300">
          <div className="flex items-center justify-between text-white/70 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Wind Speed</span>
            <Icons.Wind size={18} className="text-teal-200" />
          </div>
          <div id="metric-wind-val" className="text-2xl font-bold font-display">
            {windSpeed.toFixed(1)} <span className="text-xs font-normal">{windUnit}</span>
          </div>
          <p className="text-[10px] text-white/70 mt-1">Horizontal air motion</p>
        </div>

        {/* Pressure */}
        <div id="metric-pressure" className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300">
          <div className="flex items-center justify-between text-white/70 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pressure</span>
            <Icons.Compass size={18} className="text-amber-200" />
          </div>
          <div id="metric-pressure-val" className="text-2xl font-bold font-display">{Math.round(current.pressure_msl)} <span className="text-xs font-normal">hPa</span></div>
          <p className="text-[10px] text-white/70 mt-1">At mean sea level</p>
        </div>

        {/* Cloud Cover */}
        <div id="metric-cloudiness" className="bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all duration-300">
          <div className="flex items-center justify-between text-white/70 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cloud Cover</span>
            <Icons.Cloud size={18} className="text-slate-100" />
          </div>
          <div id="metric-cloudiness-val" className="text-2xl font-bold font-display">{current.cloud_cover}%</div>
          <p className="text-[10px] text-white/70 mt-1">Sky opacity fraction</p>
        </div>

      </div>

      {/* Precipitation highlight bar if it is raining */}
      {hasPrecipitation && (
        <div id="precipitation-alert-bar" className="relative z-10 mt-5 bg-blue-500/20 backdrop-blur-sm border border-blue-400/25 rounded-xl p-3.5 flex items-center gap-3 animate-pulse">
          <Icons.Umbrella className="text-blue-300 shrink-0" size={18} />
          <span className="text-xs font-medium leading-normal">
            Precipitation alert: <strong>{precipitation} mm</strong> of rain or snow observed recently. Take precautions if walking or driving.
          </span>
        </div>
      )}
    </div>
  );
}
