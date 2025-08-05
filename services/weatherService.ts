import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { OpenWeatherMapForecast, OpenWeatherMapResponse, WeatherData } from '../types';

// Получаем API ключ из переменных окружения
const API_KEY = Constants.expoConfig?.extra?.OPENWEATHERMAP_API_KEY || 'demo_key';
const BASE_URL = Constants.expoConfig?.extra?.OPENWEATHERMAP_BASE_URL || 'https://api.openweathermap.org/data/2.5';

console.log('🔑 [weatherService] API Key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'not found');
console.log('🌐 [weatherService] Base URL:', BASE_URL);

// Функция для генерации mock данных в случае отсутствия API ключа или ошибки
function getMockWeatherData(location: string): WeatherData {
  const weatherDescriptions = [
    'clear sky', 'few clouds', 'scattered clouds', 'broken clouds',
    'shower rain', 'rain', 'thunderstorm', 'snow', 'mist',
    'partly cloudy', 'cloudy', 'overcast', 'light rain', 'heavy rain', 'drizzle'
  ];
  
  const randomDescription = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)];
  
  return {
    location: location,
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
}

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

  async getWeatherByLocation(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      console.log('🌤️ [weatherService] Получаем погоду по координатам:', lat, lon);
      
      if (API_KEY === 'demo_key' || !API_KEY) {
        console.warn('⚠️ [weatherService] Используются mock данные - API ключ не настроен');
        return getMockWeatherData('Current Location');
      }

      // Запрос текущей погоды
      const currentWeatherUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log('🌐 [weatherService] URL текущей погоды:', currentWeatherUrl.replace(API_KEY, 'HIDDEN'));
      
      const currentResponse = await fetch(currentWeatherUrl);
      if (!currentResponse.ok) {
        throw new Error(`HTTP error! status: ${currentResponse.status}`);
      }
      const currentData: OpenWeatherMapResponse = await currentResponse.json();
      
      // Запрос прогноза на 5 дней
      const forecastUrl = `${BASE_URL}/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log('🌐 [weatherService] URL прогноза:', forecastUrl.replace(API_KEY, 'HIDDEN'));
      
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      const forecastData: OpenWeatherMapForecast = await forecastResponse.json();

      // Обрабатываем данные прогноза - берем один прогноз на день (в полдень)
      const dailyForecasts = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);

      const weatherData: WeatherData = {
        location: currentData.name || 'Current Location',
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        forecast: dailyForecasts.map((item) => ({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          temp_max: Math.round(item.main.temp_max),
          temp_min: Math.round(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })),
      };

      console.log('✅ [weatherService] Реальные данные погоды получены:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('❌ [weatherService] Ошибка получения погоды по координатам:', error);
      console.warn('⚠️ [weatherService] Возвращаем mock данные из-за ошибки');
      return getMockWeatherData('Current Location');
    }
  },

  async getWeatherByCity(city: string): Promise<WeatherData | null> {
    try {
      console.log('🏙️ [weatherService] Получаем погоду для города:', city);
      
      if (API_KEY === 'demo_key' || !API_KEY) {
        console.warn('⚠️ [weatherService] Используются mock данные - API ключ не настроен');
        return getMockWeatherData(city);
      }

      // Запрос текущей погоды по названию города
      const currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log('🌐 [weatherService] URL текущей погоды:', currentWeatherUrl.replace(API_KEY, 'HIDDEN'));
      
      const currentResponse = await fetch(currentWeatherUrl);
      if (!currentResponse.ok) {
        throw new Error(`HTTP error! status: ${currentResponse.status}`);
      }
      const currentData: OpenWeatherMapResponse = await currentResponse.json();
      
      // Запрос прогноза на 5 дней для найденного города
      const forecastUrl = `${BASE_URL}/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}&units=metric&lang=ru`;
      console.log('🌐 [weatherService] URL прогноза:', forecastUrl.replace(API_KEY, 'HIDDEN'));
      
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      const forecastData: OpenWeatherMapForecast = await forecastResponse.json();

      // Обрабатываем данные прогноза - берем один прогноз на день (в полдень)
      const dailyForecasts = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);

      const weatherData: WeatherData = {
        location: currentData.name || city,
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        forecast: dailyForecasts.map((item) => ({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          temp_max: Math.round(item.main.temp_max),
          temp_min: Math.round(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })),
      };

      console.log('✅ [weatherService] Реальные данные погоды для города получены:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('❌ [weatherService] Ошибка получения погоды для города:', error);
      console.warn('⚠️ [weatherService] Возвращаем mock данные из-за ошибки');
      return getMockWeatherData(city);
    }
  },

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};
