import React from "react";
import { DailyForecast } from "../types";
import { getWeatherCondition } from "../utils/weatherUtils";
import { WeatherIcon } from "./WeatherDetails";
import { Sun, CloudRain, Wind, ShieldAlert } from "lucide-react";

interface WeatherForecastProps {
  forecasts: DailyForecast[];
  unit: "metric" | "imperial";
}

export default function WeatherForecast({ forecasts, unit }: WeatherForecastProps) {
  const isMetric = unit === "metric";
  const tempUnit = isMetric ? "°C" : "°F";
  const windUnit = isMetric ? "km/h" : "mph";

  // Helper to color UV index values
  const getUvBadgeClass = (uv: number) => {
    if (uv >= 8) return "bg-red-50 text-red-700 border-red-100";
    if (uv >= 5) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  return (
    <div id="weather-forecast-container" className="w-full mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="text-amber-500" size={20} />
        <h2 id="forecast-header-title" className="text-xl font-bold font-display text-slate-800">
          7-Day Intelligence Forecast
        </h2>
      </div>

      {/* Grid: 1 col on mobile, 3 cols on tablet, 7 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {forecasts.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode, 1);
          
          // Temperature Conversions
          const tempMax = isMetric ? day.tempMax : (day.tempMax * 9) / 5 + 32;
          const tempMin = isMetric ? day.tempMin : (day.tempMin * 9) / 5 + 32;
          const windSpeed = isMetric ? day.windSpeedMax : day.windSpeedMax * 0.621371;

          return (
            <div
              id={`forecast-card-day-${idx}`}
              key={day.date}
              className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Header: Date */}
              <div className="text-center pb-2 border-b border-slate-100">
                <div id={`forecast-day-name-${idx}`} className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {day.dayName}
                </div>
                <div id={`forecast-date-label-${idx}`} className="text-[11px] text-slate-400 font-medium">
                  {day.date}
                </div>
              </div>

              {/* Weather Icon and Label */}
              <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center my-4 gap-2">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${condition.bgGradient.replace("text-slate-900", "").replace("text-white", "")} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <WeatherIcon name={condition.iconName} className="text-slate-800 dark:text-white" size={22} />
                </div>
                <div id={`forecast-condition-${idx}`} className="text-xs font-semibold text-slate-600 text-center sm:max-w-[90px] truncate">
                  {condition.label}
                </div>
              </div>

              {/* Temperature block */}
              <div className="flex items-center justify-between sm:justify-center gap-3 py-1.5 bg-slate-50 rounded-xl px-2.5">
                <span id={`forecast-temp-max-${idx}`} className="text-sm font-bold text-slate-800">
                  {Math.round(tempMax)}{tempUnit}
                </span>
                <div className="h-3 w-[1px] bg-slate-200"></div>
                <span id={`forecast-temp-min-${idx}`} className="text-sm font-medium text-slate-400">
                  {Math.round(tempMin)}{tempUnit}
                </span>
              </div>

              {/* Advanced Indicators */}
              <div className="space-y-1.5 mt-3 text-[10px]">
                {/* Rain */}
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <CloudRain size={11} className="text-blue-400" /> Rain
                  </span>
                  <span id={`forecast-rain-val-${idx}`} className="font-mono font-medium">
                    {day.precipitationSum > 0 ? `${day.precipitationSum.toFixed(1)}mm` : "0mm"}
                  </span>
                </div>

                {/* Wind */}
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <Wind size={11} className="text-slate-400" /> Wind
                  </span>
                  <span id={`forecast-wind-val-${idx}`} className="font-mono font-medium">
                    {Math.round(windSpeed)} {windUnit}
                  </span>
                </div>

                {/* UV Index */}
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldAlert size={11} className="text-amber-500" /> UV Index
                  </span>
                  <span
                    id={`forecast-uv-val-${idx}`}
                    className={`font-mono px-1 py-0.5 rounded border text-[9px] font-bold ${getUvBadgeClass(day.uvIndex)}`}
                  >
                    {day.uvIndex.toFixed(0)}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
