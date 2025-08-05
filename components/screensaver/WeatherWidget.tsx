import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { weatherService } from '../../services/weatherService';
import { Settings, WeatherData } from '../../types';
import { convertTemperature, formatTemperature } from '../../utils/localization';

interface WeatherWidgetProps {
  settings: Settings;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ settings }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeatherData = useCallback(async () => {
    if (!settings.weatherEnabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let weather: WeatherData | null = null;

      if (settings.weatherLocation === 'auto') {
        const location = await weatherService.getCurrentLocation();
        if (location) {
          weather = await weatherService.getWeatherByLocation(
            location.latitude, 
            location.longitude
          );
        }
      } else {
        weather = await weatherService.getWeatherByCity(settings.weatherLocation);
      }

      setWeatherData(weather);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setLoading(false);
    }
  }, [settings.weatherEnabled, settings.weatherLocation]);

  useEffect(() => {
    loadWeatherData();
    
    // Обновляем погоду каждые 30 минут
    const weatherInterval = setInterval(loadWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
  }, [loadWeatherData]);

  const getWeatherIcon = (iconCode: string): string => {
    // Простые emoji иконки для демонстрации
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️',
    };
    
    return iconMap[iconCode] || '☀️';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  if (!settings.weatherEnabled) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Weather unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Текущая погода */}
      <View style={styles.currentWeather}>
        <View style={styles.weatherHeader}>
          <Text style={styles.locationText}>{weatherData.location}</Text>
        </View>
        
        <View style={styles.currentWeatherContent}>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weatherData.icon)}
          </Text>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperatureText}>
              {formatTemperature(
                convertTemperature(weatherData.temperature, 'celsius', settings.temperatureUnit),
                settings.temperatureUnit
              )}
            </Text>
            <Text style={styles.descriptionText}>{weatherData.description}</Text>
          </View>
        </View>
      </View>

      {/* Прогноз */}
      {settings.showForecast && weatherData.forecast && (
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weatherData.forecast.slice(0, settings.forecastDays).map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastDayText}>{formatDate(day.date)}</Text>
                <Text style={styles.forecastIcon}>{getWeatherIcon(day.icon)}</Text>
                <Text style={styles.forecastTemp}>
                  {formatTemperature(
                    convertTemperature(day.temp_max, 'celsius', settings.temperatureUnit),
                    settings.temperatureUnit
                  )}/
                  {formatTemperature(
                    convertTemperature(day.temp_min, 'celsius', settings.temperatureUnit),
                    settings.temperatureUnit
                  )}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    minWidth: 300,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  currentWeather: {
    marginBottom: 20,
  },
  weatherHeader: {
    marginBottom: 15,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  currentWeatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 60,
    marginRight: 20,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperatureText: {
    color: 'white',
    fontSize: 48,
    fontWeight: '200',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textTransform: 'capitalize',
  },
  forecastContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  forecastTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  forecastDay: {
    alignItems: 'center',
    marginRight: 15,
    minWidth: 60,
  },
  forecastDayText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 5,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  forecastTemp: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});
