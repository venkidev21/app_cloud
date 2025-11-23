import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, ExternalLink } from 'lucide-react';
import { getWeather } from './services/geminiService';
import { WeatherData, GroundingSource } from './types';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastChart } from './components/ForecastChart';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setSources([]);

    try {
      const result = await getWeather(searchTerm);
      if (result.error) {
        setError(result.error);
      } else {
        setWeather(result.data);
        setSources(result.sources);
      }
    } catch (e) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchWeather(query);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude}, ${longitude}`);
        },
        (err) => {
          setError("Unable to retrieve location. Please type a city name.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Initial load
  useEffect(() => {
    // Optional: Load a default city or ask for location immediately
    // For this demo, let's start empty or simple
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-6 px-4 md:px-0">
      <div className="w-full max-w-md">
        
        {/* Header / Search */}
        <div className="sticky top-4 z-50">
          <form onSubmit={handleSearch} className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700 text-white placeholder-slate-400 rounded-full py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all"
            />
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <button 
                type="button"
                onClick={handleLocationClick}
                className="absolute right-3 p-2 hover:bg-slate-700 rounded-full transition-colors group"
                title="Use current location"
            >
                <MapPin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="mt-2 min-h-[600px]">
          
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-in fade-in zoom-in duration-300">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-slate-400 font-medium">Consulting the skies via Gemini...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center">
              <p>{error}</p>
            </div>
          )}

          {!loading && !weather && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center mt-10">
               <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Search className="w-10 h-10 opacity-50" />
               </div>
               <p className="text-lg font-medium">Search for a city or use your location</p>
               <p className="text-sm opacity-60">Real-time data powered by Gemini 2.5</p>
            </div>
          )}

          {!loading && weather && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
              
              <CurrentWeather data={weather.current} location={weather.location} />
              
              <ForecastChart data={weather.forecast} />

              <div className="mt-6 grid grid-cols-1 gap-4">
                 <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Details</h3>
                    <div className="flex justify-between items-center border-b border-slate-700/50 pb-2 mb-2">
                        <span className="text-slate-300">UV Index</span>
                        <span className="font-semibold text-white">{weather.current.uv_index}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-300">Visibility</span>
                        <span className="font-semibold text-white">Good</span>
                    </div>
                 </div>
              </div>

              {/* Data Sources / Grounding */}
              {sources.length > 0 && (
                <div className="mt-8 mb-10 pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Sources Verified by Google Search
                  </h4>
                  <ul className="space-y-2">
                    {sources.map((source, index) => (
                      <li key={index}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors truncate"
                        >
                          <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{source.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
