import React from "react";
import { PlanningRecommendation } from "../types";
import { 
  Sparkles, 
  Umbrella, 
  Thermometer, 
  ShieldAlert, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  CalendarCheck
} from "lucide-react";

interface WeatherRecommendationsProps {
  recommendations: PlanningRecommendation[];
}

export default function WeatherRecommendations({ recommendations }: WeatherRecommendationsProps) {
  
  // Return icon based on type
  const getRecommendationIcon = (type: string, level: string) => {
    switch (type) {
      case "umbrella":
        return <Umbrella className={level === "success" ? "text-emerald-500" : level === "warning" ? "text-amber-500" : "text-blue-500"} size={22} />;
      case "temperature":
        return <Thermometer className={level === "danger" ? "text-red-500" : "text-amber-500"} size={22} />;
      case "outdoor":
        return <Sparkles className={level === "success" ? "text-emerald-500" : "text-slate-500"} size={22} />;
      case "uv":
        return <ShieldAlert className={level === "danger" ? "text-red-500" : "text-amber-500"} size={22} />;
      case "wind":
        return <Wind className={level === "danger" ? "text-rose-500" : "text-amber-500"} size={22} />;
      default:
        return <Info className="text-blue-500" size={22} />;
    }
  };

  // Class mapping for card borders/backgrounds based on hazard severity
  const getCardStyle = (level: string) => {
    switch (level) {
      case "danger":
        return "bg-rose-50/70 border-rose-150 text-rose-950 shadow-rose-100/20";
      case "warning":
        return "bg-amber-50/70 border-amber-150 text-amber-950 shadow-amber-100/20";
      case "success":
        return "bg-emerald-50/70 border-emerald-150 text-emerald-950 shadow-emerald-100/20";
      case "info":
      default:
        return "bg-blue-50/70 border-blue-150 text-blue-950 shadow-blue-100/20";
    }
  };

  // Severity badge style helper
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case "danger":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "warning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "success":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "info":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div id="weather-recommendations-section" className="w-full mt-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <CalendarCheck className="text-blue-600" size={22} />
        <h2 id="recommendations-header-title" className="text-xl font-bold font-display text-slate-800">
          Smart Planning Intelligence
        </h2>
      </div>

      {recommendations.length === 0 ? (
        <div id="no-recommendations-message" className="text-center py-6 text-slate-500 text-sm">
          No special warnings or recommendations for today. Sky looks calm!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              id={`recommendation-card-${rec.id}`}
              key={rec.id}
              className={`border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 shadow-sm hover:shadow-md ${getCardStyle(rec.level)}`}
            >
              {/* Icon Container */}
              <div className="p-3 bg-white rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                {getRecommendationIcon(rec.type, rec.level)}
              </div>

              {/* Text info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 id={`recommendation-title-${rec.id}`} className="font-bold text-slate-800 text-sm sm:text-base">
                    {rec.title}
                  </h3>
                  <span
                    id={`recommendation-badge-${rec.id}`}
                    className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getBadgeStyle(rec.level)}`}
                  >
                    {rec.level}
                  </span>
                </div>
                <p id={`recommendation-desc-${rec.id}`} className="text-xs text-slate-600 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
