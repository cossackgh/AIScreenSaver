import * as Localization from 'expo-localization';

// Поддерживаемые языки
export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'ru': 'Русский',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Переводы для интерфейса
export const translations = {
  en: {
    settings: 'Settings',
    screensaver: 'Screensaver',
    time: 'Time & Date',
    weather: 'Weather',
    background: 'Background',
    general: 'General',
    appearance: 'Appearance',
    timeFormat: 'Time Format',
    showSeconds: 'Show Seconds',
    showDate: 'Show Date',
    dateFormat: 'Date Format',
    language: 'Language',
    clockFontSize: 'Clock Font Size',
    clockColor: 'Clock Color',
    clockOpacity: 'Clock Opacity',
    dateFontSize: 'Date Font Size',
    weatherEnabled: 'Enable Weather',
    showForecast: 'Show Forecast',
    forecastDays: 'Forecast Days',
    temperatureUnit: 'Temperature Unit',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    imageRepository: 'Image Repository',
    transitionEffect: 'Transition Effect',
    changeInterval: 'Change Interval',
    keepScreenOn: 'Keep Screen On',
    minutes: 'minutes',
    days: 'days',
    notSupportedOnWeb: 'Not supported on web',
  },
  ru: {
    settings: 'Настройки',
    screensaver: 'Заставка',
    time: 'Время и дата',
    weather: 'Погода',
    background: 'Фон',
    general: 'Общие',
    appearance: 'Внешний вид',
    timeFormat: 'Формат времени',
    showSeconds: 'Показывать секунды',
    showDate: 'Показывать дату',
    dateFormat: 'Формат даты',
    language: 'Язык',
    clockFontSize: 'Размер шрифта часов',
    clockColor: 'Цвет часов',
    clockOpacity: 'Прозрачность часов',
    dateFontSize: 'Размер шрифта даты',
    weatherEnabled: 'Включить погоду',
    showForecast: 'Показывать прогноз',
    forecastDays: 'Дней прогноза',
    temperatureUnit: 'Единицы температуры',
    celsius: 'Цельсий (°C)',
    fahrenheit: 'Фаренгейт (°F)',
    imageRepository: 'Репозиторий изображений',
    transitionEffect: 'Эффект перехода',
    changeInterval: 'Интервал смены',
    keepScreenOn: 'Не выключать экран',
    minutes: 'минут',
    days: 'дней',
    notSupportedOnWeb: 'Не поддерживается в веб',
  },
} as const;

// Получение языка системы
export function getSystemLanguage(): SupportedLanguage {
  try {
    const locales = Localization.getLocales();
    const primaryLocale = locales[0]?.languageCode || 'en';
    
    // Проверяем, поддерживается ли язык
    if (primaryLocale in SUPPORTED_LANGUAGES) {
      return primaryLocale as SupportedLanguage;
    }
    
    // Возвращаем английский по умолчанию
    return 'en';
  } catch (error) {
    console.warn('Failed to get system language:', error);
    return 'en';
  }
}

// Получение единиц измерения температуры по региону
export function getSystemTemperatureUnit(): 'celsius' | 'fahrenheit' {
  try {
    const locales = Localization.getLocales();
    const region = locales[0]?.regionCode;
    
    // Страны, использующие Фаренгейт
    const fahrenheitCountries = ['US', 'LR', 'MM', 'BS', 'BZ', 'KY', 'PW'];
    
    if (region && fahrenheitCountries.includes(region)) {
      return 'fahrenheit';
    }
    
    return 'celsius';
  } catch (error) {
    console.warn('Failed to get system temperature unit:', error);
    return 'celsius';
  }
}

// Функция для получения переводов
export function getTranslation(language: SupportedLanguage, key: keyof typeof translations.en): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

// Конвертация температуры
export function convertTemperature(temp: number, fromUnit: 'celsius' | 'fahrenheit', toUnit: 'celsius' | 'fahrenheit'): number {
  if (fromUnit === toUnit) return temp;
  
  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return (temp * 9/5) + 32;
  } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
    return (temp - 32) * 5/9;
  }
  
  return temp;
}

// Форматирование температуры с единицами
export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): string {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
}

// Форматирование даты в зависимости от языка
export function formatDate(date: Date, language: SupportedLanguage): string {
  try {
    const locale = language === 'en' ? 'en-US' : 'ru-RU';
    
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Failed to format date:', error);
    return date.toLocaleDateString();
  }
}

// Форматирование времени в зависимости от языка
export function formatTime(date: Date, language: SupportedLanguage, format: '12h' | '24h', showSeconds: boolean = false): string {
  try {
    const locale = language === 'en' ? 'en-US' : 'ru-RU';
    
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: format === '12h'
    };
    
    if (showSeconds) {
      options.second = '2-digit';
    }
    
    return date.toLocaleTimeString(locale, options);
  } catch (error) {
    console.warn('Failed to format time:', error);
    return date.toLocaleTimeString();
  }
}
