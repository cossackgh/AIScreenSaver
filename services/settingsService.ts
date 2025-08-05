import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types';
import { getSystemLanguage, getSystemTemperatureUnit } from '../utils/localization';

const SETTINGS_KEY = 'screensaver_settings';

// Создаем настройки по умолчанию с учетом системных предпочтений
function createDefaultSettings(): Settings {
  return {
    timeFormat: '24h',
    showSeconds: true,
    showDate: true,
    dateFormat: 'DD/MM/YYYY',
    language: getSystemLanguage(), // Автоматическое определение языка системы
    
    // Настройки отображения часов
    clockFontSize: 300, // Увеличенный размер шрифта часов
    clockColor: '#ffffff', // Белый цвет по умолчанию
    clockOpacity: 0.6, // Полупрозрачность по умолчанию
    dateFontSize: 44, // Увеличенный размер шрифта даты
    
    weatherEnabled: true,
    weatherLocation: 'auto',
    weatherCities: ['auto'], // По умолчанию только автоопределение
    currentCityIndex: 0, // Индекс текущего города (auto)
    showForecast: true,
    forecastDays: 5,
    temperatureUnit: getSystemTemperatureUnit(), // Автоматическое определение единиц температуры
    imageRepository: 'https://github.com/cossackgh/screen-wallpapers/tree/262c161ca691d218d86c1f7bcb0fd4afa3cf40e1/Arts',
    imageTransitionEffect: 'fade',
    imageChangeInterval: 5,
    imageDisplayOrder: 'sequential',
    keepScreenOn: true,
  };
}

export const defaultSettings: Settings = createDefaultSettings();

export const settingsService = {
  async getSettings(): Promise<Settings> {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settings) {
        return { ...defaultSettings, ...JSON.parse(settings) };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  },

  async saveSettings(settings: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  },
};
