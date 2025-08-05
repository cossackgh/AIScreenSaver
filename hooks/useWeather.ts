import { useState, useEffect, useCallback } from 'react';
import { WeatherData, Settings } from '../types';
import { weatherService } from '../services/weatherService';

interface UseWeatherResult {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export const useWeather = (settings: Settings): UseWeatherResult => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeatherData = useCallback(async () => {
    if (!settings.weatherEnabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let weather: WeatherData | null = null;

      if (settings.weatherLocation === 'auto') {
        const location = await weatherService.getCurrentLocation();
        if (location) {
          weather = await weatherService.getWeatherByLocation(
            location.latitude,
            location.longitude
          );
        } else {
          throw new Error('Unable to get current location');
        }
      } else {
        weather = await weatherService.getWeatherByCity(settings.weatherLocation);
      }

      if (!weather) {
        throw new Error('Weather data not available');
      }

      setWeatherData(weather);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather';
      setError(errorMessage);
      console.error('Error loading weather:', err);
    } finally {
      setLoading(false);
    }
  }, [settings.weatherEnabled, settings.weatherLocation]);

  const refresh = useCallback(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // Load weather data when settings change
  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // Auto-refresh weather data every 30 minutes
  useEffect(() => {
    if (settings.weatherEnabled) {
      const interval = setInterval(() => {
        loadWeatherData();
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(interval);
    }
  }, [settings.weatherEnabled, loadWeatherData]);

  return {
    weatherData,
    loading,
    error,
    lastUpdated,
    refresh,
  };
};
