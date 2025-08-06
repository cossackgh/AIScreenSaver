import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  color?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  size = 60, 
  color = '#FFFFFF' 
}) => {
  const getWeatherIcon = (code: string) => {
    // Маппинг кодов OpenWeatherMap на иконки
    const iconMap: { [key: string]: { family: string; name: string } } = {
      // Ясное небо
      '01d': { family: 'Feather', name: 'sun' },
      '01n': { family: 'Feather', name: 'moon' },
      
      // Малооблачно
      '02d': { family: 'MaterialCommunityIcons', name: 'weather-partly-cloudy' },
      '02n': { family: 'MaterialCommunityIcons', name: 'weather-night-partly-cloudy' },
      
      // Рассеянные облака
      '03d': { family: 'Feather', name: 'cloud' },
      '03n': { family: 'Feather', name: 'cloud' },
      
      // Сломанные облака
      '04d': { family: 'MaterialCommunityIcons', name: 'weather-cloudy' },
      '04n': { family: 'MaterialCommunityIcons', name: 'weather-cloudy' },
      
      // Ливневые дожди
      '09d': { family: 'MaterialCommunityIcons', name: 'weather-pouring' },
      '09n': { family: 'MaterialCommunityIcons', name: 'weather-pouring' },
      
      // Дождь
      '10d': { family: 'MaterialCommunityIcons', name: 'weather-rainy' },
      '10n': { family: 'MaterialCommunityIcons', name: 'weather-rainy' },
      
      // Гроза
      '11d': { family: 'MaterialCommunityIcons', name: 'weather-lightning' },
      '11n': { family: 'MaterialCommunityIcons', name: 'weather-lightning' },
      
      // Снег
      '13d': { family: 'MaterialCommunityIcons', name: 'weather-snowy' },
      '13n': { family: 'MaterialCommunityIcons', name: 'weather-snowy' },
      
      // Туман
      '50d': { family: 'MaterialCommunityIcons', name: 'weather-fog' },
      '50n': { family: 'MaterialCommunityIcons', name: 'weather-fog' },
    };
    
    return iconMap[code] || { family: 'Feather', name: 'sun' };
  };

  const icon = getWeatherIcon(iconCode);

  // Рендерим иконку в зависимости от семейства
  switch (icon.family) {
    case 'MaterialCommunityIcons':
      return (
        <MaterialCommunityIcons 
          name={icon.name as any} 
          size={size} 
          color={color} 
        />
      );
    case 'Feather':
      return (
        <Feather 
          name={icon.name as any} 
          size={size} 
          color={color} 
        />
      );
    case 'Ionicons':
      return (
        <Ionicons 
          name={icon.name as any} 
          size={size} 
          color={color} 
        />
      );
    default:
      return (
        <Feather 
          name="sun" 
          size={size} 
          color={color} 
        />
      );
  }
};
