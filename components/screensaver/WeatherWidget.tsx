import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { weatherService } from '../../services/weatherService';
import { Settings, WeatherData } from '../../types';
import {
  convertTemperature,
  formatDayOfWeek,
  formatLocationName,
  formatTemperature,
  getTranslation,
  translateWeatherDescription
} from '../../utils/localization';
import { WeatherIcon } from './WeatherIcon';

interface WeatherWidgetProps {
  settings: Settings;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ settings }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeatherData = useCallback(async () => {
    console.log('🌤️ [WeatherWidget] Начинаем загрузку погоды, включена:', settings.weatherEnabled);
    
    if (!settings.weatherEnabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let weather: WeatherData | null = null;

      // Получаем текущий город из массива городов
      const currentCity = settings.weatherCities?.[settings.currentCityIndex] || settings.weatherLocation || 'auto';
      console.log('🌤️ [WeatherWidget] Текущий город:', currentCity, 'индекс:', settings.currentCityIndex);

      if (currentCity === 'auto') {
        console.log('🌤️ [WeatherWidget] Получаем автоматическое местоположение');
        const location = await weatherService.getCurrentLocation();
        if (location) {
          console.log('🌤️ [WeatherWidget] Местоположение получено:', location);
          weather = await weatherService.getWeatherByLocation(
            location.latitude, 
            location.longitude
          );
        } else {
          console.warn('🌤️ [WeatherWidget] Не удалось получить местоположение');
        }
      } else {
        console.log('🌤️ [WeatherWidget] Получаем погоду для города:', currentCity);
        weather = await weatherService.getWeatherByCity(currentCity);
      }

      console.log('🌤️ [WeatherWidget] Данные погоды получены:', weather);
      setWeatherData(weather);
    } catch (error) {
      console.error('❌ [WeatherWidget] Ошибка загрузки погоды:', error);
      setWeatherData(null);
    } finally {
      setLoading(false);
      console.log('🌤️ [WeatherWidget] Загрузка погоды завершена');
    }
  }, [settings.weatherEnabled, settings.weatherCities, settings.currentCityIndex, settings.weatherLocation]);

  useEffect(() => {
    loadWeatherData();
    
    // Обновляем погоду каждые 30 минут
    const weatherInterval = setInterval(loadWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
  }, [loadWeatherData]);

  const formatDate = (dateString: string): string => {
    return formatDayOfWeek(dateString, settings.language as any);
  };

  if (!settings.weatherEnabled) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {getTranslation(settings.language as any, 'loading' as any) || 'Loading weather...'}
        </Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {getTranslation(settings.language as any, 'weatherUnavailable' as any) || 'Weather unavailable'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Текущая погода */}
      <View style={styles.currentWeather}>
        <View style={styles.weatherHeader}>
          <Text style={styles.locationText}>
            {(() => {
              const currentCity = settings.weatherCities?.[settings.currentCityIndex] || settings.weatherLocation || 'auto';
              if (currentCity === 'auto') {
                return formatLocationName(weatherData.location, settings.language as any);
              } else {
                return currentCity;
              }
            })()}
          </Text>
        </View>
        
        <View style={styles.currentWeatherContent}>
          <WeatherIcon iconCode={weatherData.icon} size={60} color="white" />
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperatureText}>
              {formatTemperature(
                convertTemperature(weatherData.temperature || 0, 'celsius', settings.temperatureUnit),
                settings.temperatureUnit
              )}
            </Text>
            <Text style={styles.descriptionText}>
              {translateWeatherDescription(weatherData.description || '', settings.language as any)}
            </Text>
          </View>
        </View>
      </View>

      {/* Прогноз */}
      {settings.showForecast && weatherData.forecast && (
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>
            {getTranslation(settings.language as any, 'forecast')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weatherData.forecast.slice(0, settings.forecastDays).map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastDayText}>{formatDate(day.date)}</Text>
                <WeatherIcon iconCode={day.icon} size={24} color="white" />
                <View style={styles.temperatureRow}>
                  <View style={styles.tempItem}>
                    <Feather name="sun" size={10} color="rgba(255, 215, 0, 0.8)" />
                    <Text style={styles.forecastTemp}>
                      {formatTemperature(
                        convertTemperature(day.temp_max || 0, 'celsius', settings.temperatureUnit),
                        settings.temperatureUnit
                      )}°
                    </Text>
                  </View>
                  <Text style={styles.temperatureSeparator}>/</Text>
                  <View style={styles.tempItem}>
                    <Feather name="moon" size={10} color="rgba(173, 216, 230, 0.8)" />
                    <Text style={styles.forecastTemp}>
                      {formatTemperature(
                        convertTemperature(day.temp_night || 0, 'celsius', settings.temperatureUnit),
                        settings.temperatureUnit
                      )}°
                    </Text>
                  </View>
                </View>
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
  forecastTemp: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  tempItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  temperatureSeparator: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginHorizontal: 4,
  },
});
