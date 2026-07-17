import { 
  CurrentWeatherData, 
  DailyForecast, 
  PlanningRecommendation, 
  WeatherConditionDetails 
} from "../types";

/**
 * Maps WMO (World Meteorological Organization) weather codes to human-readable text,
 * aesthetic Tailwind gradients, solid colors, and lucide icon names.
 */
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionDetails {
  const isNight = isDay === 0;

  // Key-value mapping for categories
  switch (code) {
    case 0: // Clear Sky
      return {
        label: "Clear Sky",
        description: isNight ? "Calm and clear starry night." : "Perfectly clear and sunny sky.",
        iconName: isNight ? "Moon" : "Sun",
        bgGradient: isNight 
          ? "from-slate-900 via-indigo-950 to-slate-900 text-white" 
          : "from-amber-400 via-orange-400 to-sky-400 text-slate-900",
        themeColor: "amber-500",
      };

    case 1: // Mainly Clear
    case 2: // Partly Cloudy
      return {
        label: "Partly Cloudy",
        description: "Scattered clouds with intervals of sun.",
        iconName: isNight ? "CloudMoon" : "CloudSun",
        bgGradient: isNight
          ? "from-slate-900 via-slate-800 to-indigo-950 text-white"
          : "from-sky-400 via-blue-400 to-slate-200 text-slate-900",
        themeColor: "sky-500",
      };

    case 3: // Overcast
      return {
        label: "Overcast",
        description: "Thick cloud blanket covering the sky.",
        iconName: "Cloud",
        bgGradient: "from-slate-400 via-zinc-400 to-slate-500 text-slate-900",
        themeColor: "slate-400",
      };

    case 45: // Fog
    case 48: // Depositing rime fog
      return {
        label: "Foggy",
        description: "Dense fog with restricted visibility.",
        iconName: "CloudFog",
        bgGradient: "from-zinc-300 via-slate-300 to-zinc-400 text-slate-800",
        themeColor: "zinc-400",
      };

    case 51: // Light Drizzle
    case 53: // Moderate Drizzle
    case 55: // Dense Drizzle
      return {
        label: "Drizzle",
        description: "Continuous light misty drizzle.",
        iconName: "CloudDrizzle",
        bgGradient: "from-cyan-300 via-teal-400 to-slate-400 text-slate-950",
        themeColor: "cyan-500",
      };

    case 56: // Light Freezing Drizzle
    case 57: // Dense Freezing Drizzle
    case 66: // Light Freezing Rain
    case 67: // Heavy Freezing Rain
      return {
        label: "Freezing Rain",
        description: "Icy rain freezing upon surface contact.",
        iconName: "CloudHail",
        bgGradient: "from-blue-200 via-sky-300 to-indigo-400 text-slate-900",
        themeColor: "blue-400",
      };

    case 61: // Slight Rain
    case 63: // Moderate Rain
      return {
        label: "Rainy",
        description: "Steady rainfall. Keep your boots ready.",
        iconName: "CloudRain",
        bgGradient: "from-blue-400 via-indigo-400 to-slate-600 text-white",
        themeColor: "blue-500",
      };

    case 65: // Heavy Rain
      return {
        label: "Heavy Rain",
        description: "Downpour with strong rain sheets.",
        iconName: "CloudRainWind",
        bgGradient: "from-indigo-650 via-blue-750 to-slate-850 text-white",
        themeColor: "indigo-600",
      };

    case 71: // Slight Snow fall
    case 73: // Moderate Snow fall
    case 75: // Heavy Snow fall
    case 77: // Snow grains
    case 85: // Snow showers slight
    case 86: // Snow showers heavy
      return {
        label: "Snowy",
        description: "Crisp white snow flurries.",
        iconName: "Snowflake",
        bgGradient: "from-cyan-100 via-blue-100 to-slate-300 text-slate-900",
        themeColor: "cyan-200",
      };

    case 80: // Slight Rain Showers
    case 81: // Moderate Rain Showers
    case 82: // Violent Rain Showers
      return {
        label: "Showers",
        description: "Sudden heavy rain showers.",
        iconName: "CloudRain",
        bgGradient: "from-blue-400 via-cyan-500 to-slate-500 text-slate-900",
        themeColor: "cyan-600",
      };

    case 95: // Thunderstorm slight/moderate
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return {
        label: "Thunderstorm",
        description: "Electrical storm with flashes and rumbling.",
        iconName: "CloudLightning",
        bgGradient: "from-slate-900 via-purple-950 to-slate-850 text-white",
        themeColor: "purple-600",
      };

    default:
      return {
        label: "Cloudy",
        description: "Standard sky conditions.",
        iconName: "Cloud",
        bgGradient: "from-slate-200 via-slate-300 to-slate-400 text-slate-800",
        themeColor: "slate-500",
      };
  }
}

/**
 * Computes intelligent, data-driven planning recommendations based on current and 7-day forecast.
 */
export function generateRecommendations(
  current: CurrentWeatherData,
  dailyForecasts: DailyForecast[]
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];

  // 1. UMBRELLA ADVICE
  const isCurrentlyRaining = current.rain > 0.2 || current.showers > 0.2 || current.precipitation > 0.2;
  const isRainCode = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(current.weather_code);
  
  // Lookahead for rain in next 24-48 hours
  const rainForecastedSoon = dailyForecasts.slice(0, 3).some(
    d => d.precipitationSum > 1.5 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(d.weatherCode)
  );

  if (isCurrentlyRaining || isRainCode) {
    recommendations.push({
      id: "umbrella_current",
      type: "umbrella",
      level: "danger",
      title: "Carry an Umbrella",
      description: "Precipitation is actively falling right now. Bring an umbrella, raincoat, and water-resistant boots.",
    });
  } else if (rainForecastedSoon) {
    recommendations.push({
      id: "umbrella_forecast",
      type: "umbrella",
      level: "warning",
      title: "Keep Rain Gear Nearby",
      description: "Rain is forecasted over the next 48 hours. Stash a compact umbrella in your bag just in case.",
    });
  } else {
    recommendations.push({
      id: "umbrella_none",
      type: "umbrella",
      level: "success",
      title: "No Umbrella Needed",
      description: "Dry skies are ahead for the next few days. No precipitation gear required.",
    });
  }

  // 2. TEMPERATURE WARNINGS
  const currentTemp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const maxForecastTemp = Math.max(...dailyForecasts.map(d => d.tempMax));
  const minForecastTemp = Math.min(...dailyForecasts.map(d => d.tempMin));

  if (currentTemp >= 33 || apparentTemp >= 35) {
    recommendations.push({
      id: "temp_extreme_high",
      type: "temperature",
      level: "danger",
      title: "Extreme Heat Warning",
      description: `Temperature feels like ${apparentTemp.toFixed(1)}°C. Avoid prolonged outdoor exposure, drink extra electrolytes, and recognize symptoms of heat stress.`,
    });
  } else if (currentTemp >= 28) {
    recommendations.push({
      id: "temp_moderate_high",
      type: "temperature",
      level: "warning",
      title: "Warm Weather Advisory",
      description: "Warm and bright conditions. Wear lightweight clothing and remember to stay well-hydrated throughout the day.",
    });
  } else if (currentTemp <= 5 || minForecastTemp <= 0) {
    recommendations.push({
      id: "temp_extreme_low",
      type: "temperature",
      level: "danger",
      title: "Freezing Cold Warning",
      description: `Freezing or near-freezing conditions detected (Low of ${minForecastTemp.toFixed(1)}°C). Dress in heavy thermal layers, protect exposed skin, and check your home heating.`,
    });
  } else if (currentTemp <= 13) {
    recommendations.push({
      id: "temp_moderate_low",
      type: "temperature",
      level: "info",
      title: "Chilly Conditions",
      description: "A bit brisk outside. A light jacket, windbreaker, or warm sweater will keep you comfortable.",
    });
  }

  // 3. OUTDOOR ACTIVITIES RATING
  const todayForecast = dailyForecasts[0];
  const highWind = current.wind_speed_10m >= 25 || (todayForecast && todayForecast.windSpeedMax >= 30);
  const badWeather = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(current.weather_code);
  const uvExtreme = todayForecast && todayForecast.uvIndex >= 8;

  if (badWeather) {
    recommendations.push({
      id: "outdoor_bad",
      type: "outdoor",
      level: "warning",
      title: "Indoor Activities Recommended",
      description: "Current weather is stormy, rainy, or frozen. Cozy up indoors with digital entertainment, museums, or reading.",
    });
  } else if (highWind) {
    recommendations.push({
      id: "outdoor_windy",
      type: "outdoor",
      level: "info",
      title: "Windy for Outdoor Sports",
      description: "Strong breezes might affect tennis, badminton, or cycling. Great day, however, for kite flying or coastal walks!",
    });
  } else if (currentTemp >= 16 && currentTemp <= 26 && !badWeather) {
    recommendations.push({
      id: "outdoor_perfect",
      type: "outdoor",
      level: "success",
      title: "Good Day for Outdoor Activities",
      description: "Thermodynamic conditions are absolute gold! Perfect for hiking, running, dining al-fresco, or a park picnic.",
    });
  } else {
    recommendations.push({
      id: "outdoor_neutral",
      type: "outdoor",
      level: "info",
      title: "Fair Outdoor Conditions",
      description: "Generally acceptable conditions for stepping out. Dress appropriately for the local temperature.",
    });
  }

  // 4. UV INDEX warnings
  if (todayForecast) {
    const uvValue = todayForecast.uvIndex;
    if (uvValue >= 8) {
      recommendations.push({
        id: "uv_extreme",
        type: "uv",
        level: "danger",
        title: "Extreme UV Exposure Alert",
        description: `Very high UV Index of ${uvValue.toFixed(1)}. Skin can burn in minutes. Wear SPF 50+, broad-brimmed hats, polarized sunglasses, and seek midday shade.`,
      });
    } else if (uvValue >= 5) {
      recommendations.push({
        id: "uv_moderate",
        type: "uv",
        level: "warning",
        title: "Moderate to High UV Risk",
        description: `UV Index is ${uvValue.toFixed(1)}. Sun protection is advised. Apply SPF 30+ sunscreen and protect sensitive eyes.`,
      });
    }
  }

  // 5. WIND WARNINGS
  const currentWind = current.wind_speed_10m;
  if (currentWind >= 45) {
    recommendations.push({
      id: "wind_gale",
      type: "wind",
      level: "danger",
      title: "Gale-Force Wind Advisory",
      description: `Sustained wind speeds at ${currentWind.toFixed(1)} km/h. Danger of falling branches or flying debris. Secure patio furniture and use caution while driving high-profile vehicles.`,
    });
  } else if (currentWind >= 28) {
    recommendations.push({
      id: "wind_breezy",
      type: "wind",
      level: "warning",
      title: "High Wind Advisory",
      description: `Brisk winds at ${currentWind.toFixed(1)} km/h. Keep hats secured and prepare for a noticeable wind-chill factor.`,
    });
  }

  return recommendations;
}

/**
 * Returns formatted date label like "Today", "Tomorrow", or "Mon, July 17"
 */
export function formatForecastDate(dateStr: string, index: number): { dayName: string; formattedDate: string } {
  if (index === 0) {
    return { dayName: "Today", formattedDate: "Today" };
  }
  if (index === 1) {
    return { dayName: "Tomorrow", formattedDate: "Tomorrow" };
  }

  try {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { dayName, formattedDate };
  } catch (e) {
    return { dayName: "---", formattedDate: "---" };
  }
}
