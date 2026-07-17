import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, History, X, Sparkles } from "lucide-react";
import { GeocodingResult } from "../types";

interface CitySearchProps {
  onSelectCity: (city: GeocodingResult) => void;
  isLoading: boolean;
  currentCityName?: string;
}

const POPULAR_CITIES: Omit<GeocodingResult, "id">[] = [
  { name: "New York", latitude: 40.7128, longitude: -74.0060, country: "United States", country_code: "US", admin1: "New York" },
  { name: "London", latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", country_code: "GB", admin1: "England" },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, country: "Japan", country_code: "JP", admin1: "Tokyo" },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, country: "France", country_code: "FR", admin1: "Île-de-France" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "Australia", country_code: "AU", admin1: "New South Wales" },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, country: "Egypt", country_code: "EG", admin1: "Cairo" }
];

export default function CitySearch({ onSelectCity, isLoading, currentCityName }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [history, setHistory] = useState<GeocodingResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("weather_intelligence_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 5)); // Keep last 5
      } catch (e) {
        console.error("Failed to load search history", e);
      }
    }
  }, []);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced API search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingApi(true);
      setSearchError(null);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query.trim()
          )}&count=5&language=en&format=json`
        );
        if (!response.ok) {
          throw new Error("Geocoding network response was not successful");
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setResults(data.results);
        } else {
          setResults([]);
          setSearchError(`No cities found matching "${query}"`);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setSearchError("Failed to fetch location results. Check connection.");
      } finally {
        setIsSearchingApi(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setIsFocused(false);

    // Save to history
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.name !== city.name || item.country !== city.country);
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem("weather_intelligence_history", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory([]);
    localStorage.removeItem("weather_intelligence_history");
  };

  const removeHistoryItem = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      localStorage.setItem("weather_intelligence_history", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-50" ref={containerRef} id="city-search-container">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} className="stroke-[2]" />
        </div>
        <input
          type="text"
          id="city-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search city (e.g. London, San Francisco, Tokyo...)"
          className="w-full pl-12 pr-12 py-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md outline-none text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-lg transition-all"
        />
        {(query || isLoading || isSearchingApi) && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
            {(isLoading || isSearchingApi) ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <button
                id="clear-search-button"
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Suggestion Dropdown Panel */}
      {isFocused && (
        <div
          id="search-dropdown-panel"
          className="absolute w-full mt-2 bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-fade-in-up"
        >
          {/* Dynamic API Search Results */}
          {results.length > 0 && (
            <div className="p-2 border-b border-slate-100">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-3 py-1.5 flex items-center gap-1.5">
                <MapPin size={12} /> Location Matches
              </div>
              <ul className="space-y-0.5">
                {results.map((city) => (
                  <li key={city.id}>
                    <button
                      id={`city-match-${city.id}`}
                      onClick={() => handleSelect(city)}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                          {city.name}
                        </span>
                        {city.admin1 && (
                          <span className="text-xs text-slate-500 ml-1.5">
                            {city.admin1}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 ml-1">
                          ({city.country})
                        </span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                        {city.country_code || "Loc"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search Error Message */}
          {searchError && (
            <div className="p-4 text-center text-sm text-amber-600 bg-amber-50/50 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
              {searchError}
            </div>
          )}

          {/* Recent Searches */}
          {history.length > 0 && !query && (
            <div className="p-2 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <History size={12} /> Recent Searches
                </span>
                <button
                  id="clear-history-button"
                  onClick={clearHistory}
                  className="text-[10px] text-red-500 hover:underline cursor-pointer lowercase"
                >
                  Clear All
                </button>
              </div>
              <ul className="space-y-0.5">
                {history.map((city, idx) => (
                  <li key={`${city.name}-${idx}`} className="flex items-center justify-between group/item">
                    <button
                      id={`recent-city-${idx}`}
                      onClick={() => handleSelect(city)}
                      className="flex-1 text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <History size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">
                        {city.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                      </span>
                    </button>
                    <button
                      id={`remove-recent-${idx}`}
                      onClick={(e) => removeHistoryItem(e, idx)}
                      className="p-1 mr-2 text-slate-300 hover:text-slate-500 rounded-md hover:bg-slate-100 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                      title="Remove from history"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Cities */}
          <div className="p-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" /> Popular Cities
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_CITIES.map((city, idx) => (
                <button
                  id={`popular-city-${city.name.toLowerCase()}`}
                  key={city.name}
                  onClick={() => handleSelect({ ...city, id: 9000 + idx })}
                  className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-center border border-slate-100 hover:border-blue-100 transition-all cursor-pointer"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
