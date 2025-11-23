import React from 'react';
import { Cloud, Droplets, Wind, ThermometerSun, Sun } from 'lucide-react';
import { WeatherData } from '../types';

interface CurrentWeatherProps {
  data: WeatherData['current'];
  location: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, location }) => {
  return (
    <div className="relative overflow-hidden p-6 mt-6 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-2xl text-white">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute top-20 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold tracking-wide">{location}</h2>
        <span className="text-blue-100 text-sm font-medium mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>

        <div className="flex flex-col items-center mt-6">
            {/* Dynamic Icon based on simple logic - in prod mapping would be more robust */}
            {data.condition.toLowerCase().includes('rain') ? (
                <Cloud className="w-20 h-20 text-blue-200 mb-2" />
            ) : data.condition.toLowerCase().includes('cloud') ? (
                <Cloud className="w-20 h-20 text-gray-200 mb-2" />
            ) : (
                <Sun className="w-20 h-20 text-yellow-300 mb-2" />
            )}
            
          <h1 className="text-7xl font-bold ml-4">
            {Math.round(data.temp_c)}°
          </h1>
          <p className="text-xl font-medium mt-2 capitalize text-blue-100">{data.condition}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mt-8">
          <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <Wind className="w-5 h-5 text-blue-200 mb-1" />
            <span className="text-xs text-blue-100">Wind</span>
            <span className="text-lg font-semibold">{data.wind_kph} <span className="text-xs font-normal">km/h</span></span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <Droplets className="w-5 h-5 text-blue-200 mb-1" />
            <span className="text-xs text-blue-100">Humidity</span>
            <span className="text-lg font-semibold">{data.humidity}%</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <ThermometerSun className="w-5 h-5 text-blue-200 mb-1" />
            <span className="text-xs text-blue-100">Feels Like</span>
            <span className="text-lg font-semibold">{Math.round(data.feels_like_c)}°</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/20 rounded-xl w-full text-left backdrop-blur-md border-l-4 border-yellow-400">
           <p className="text-sm font-medium leading-relaxed">
             AI Insight: <span className="font-light italic opacity-90">{data.description}</span>
           </p>
        </div>
      </div>
    </div>
  );
};
