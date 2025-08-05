import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { WeatherData } from '../types';

// Получаем API ключ из переменных окружения
// В реальном приложении API ключ должен храниться в переменных окружения
const _API_KEY = Constants.expoConfig?.extra?.OPENWEATHERMAP_API_KEY || 'demo_key';
const _BASE_URL = Constants.expoConfig?.extra?.OPENWEATHERMAP_BASE_URL || 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  async getWeatherByLocation(_lat: number, _lon: number): Promise<WeatherData | null> {
    try {
      // Для демонстрации используем mock данные
      // В реальном приложении здесь будет запрос к API
      const weatherDescriptions = [
        'clear sky', 'few clouds', 'scattered clouds', 'broken clouds',
        'shower rain', 'rain', 'thunderstorm', 'snow', 'mist',
        'partly cloudy', 'cloudy', 'overcast', 'light rain', 'heavy rain', 'drizzle'
      ];
      
      const randomDescription = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)];
      
      const mockWeatherData: WeatherData = {
        location: 'Current Location',
        temperature: Math.round(Math.random() * 30 + 5),
        description: randomDescription,
        icon: '02d',
        forecast: [
          {
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            temp_max: Math.round(Math.random() * 25 + 10),
            temp_min: Math.round(Math.random() * 15 + 5),
            description: 'Sunny',
            icon: '01d',
          },
          {
            date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            temp_max: Math.round(Math.random() * 25 + 10),
            temp_min: Math.round(Math.random() * 15 + 5),
            description: 'Rainy',
            icon: '09d',
          },
          {
            date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            temp_max: Math.round(Math.random() * 25 + 10),
            temp_min: Math.round(Math.random() * 15 + 5),
            description: 'Cloudy',
            icon: '03d',
          },
          {
            date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
            temp_max: Math.round(Math.random() * 25 + 10),
            temp_min: Math.round(Math.random() * 15 + 5),
            description: 'Thunderstorm',
            icon: '11d',
          },
          {
            date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            temp_max: Math.round(Math.random() * 25 + 10),
            temp_min: Math.round(Math.random() * 15 + 5),
            description: 'Clear',
            icon: '01d',
          },
        ],
      };

      return mockWeatherData;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  },

  async getWeatherByCity(city: string): Promise<WeatherData | null> {
    try {
      // Для демонстрации используем mock данные
      const weatherDescriptions = [
        'clear sky', 'few clouds', 'scattered clouds', 'broken clouds',
        'shower rain', 'rain', 'thunderstorm', 'snow', 'mist',
        'partly cloudy', 'cloudy', 'overcast', 'light rain', 'heavy rain', 'drizzle'
      ];
      
      const randomDescription = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)];
      
      const mockWeatherData: WeatherData = {
        location: city,
        temperature: Math.round(Math.random() * 30 + 5),
        description: randomDescription,
        icon: '01d',
        forecast: [
          {
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            temp_max: Math.round(Math.random() * 25 + 10),
            temp_min: Math.round(Math.random() * 15 + 5),
            description: 'Sunny',
            icon: '01d',
          },
        ],
      };

      return mockWeatherData;
    } catch (error) {
      console.error('Error fetching weather for city:', error);
      return null;
    }
  },

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};
