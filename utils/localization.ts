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
    
    // Weather translations
    currentLocation: 'Current Location',
    weatherFor: 'Weather for',
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    pressure: 'Pressure',
    visibility: 'Visibility',
    forecast: 'Forecast',
    today: 'Today',
    tomorrow: 'Tomorrow',
    
    // Weather conditions
    clearSky: 'Clear sky',
    fewClouds: 'Few clouds',
    scatteredClouds: 'Scattered clouds',
    brokenClouds: 'Broken clouds',
    showerRain: 'Shower rain',
    rain: 'Rain',
    thunderstorm: 'Thunderstorm',
    snow: 'Snow',
    mist: 'Mist',
    partlyCloudy: 'Partly cloudy',
    cloudy: 'Cloudy',
    overcast: 'Overcast',
    lightRain: 'Light rain',
    heavyRain: 'Heavy rain',
    drizzle: 'Drizzle',
    loading: 'Loading...',
    weatherUnavailable: 'Weather unavailable',
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
    
    // Weather translations
    currentLocation: 'Текущее местоположение',
    weatherFor: 'Погода для',
    temperature: 'Температура',
    feelsLike: 'Ощущается как',
    humidity: 'Влажность',
    windSpeed: 'Скорость ветра',
    pressure: 'Давление',
    visibility: 'Видимость',
    forecast: 'Прогноз',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    
    // Weather conditions
    clearSky: 'Ясное небо',
    fewClouds: 'Малооблачно',
    scatteredClouds: 'Переменная облачность',
    brokenClouds: 'Облачно с прояснениями',
    showerRain: 'Ливень',
    rain: 'Дождь',
    thunderstorm: 'Гроза',
    snow: 'Снег',
    mist: 'Туман',
    partlyCloudy: 'Частично облачно',
    cloudy: 'Облачно',
    overcast: 'Пасмурно',
    lightRain: 'Легкий дождь',
    heavyRain: 'Сильный дождь',
    drizzle: 'Морось',
    loading: 'Загрузка...',
    weatherUnavailable: 'Погода недоступна',
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

// Функция для перевода описаний погоды
export function translateWeatherDescription(description: string, language: SupportedLanguage): string {
  // Создаем карту соответствий для английских описаний
  const weatherMap: Record<string, keyof typeof translations.en> = {
    'clear sky': 'clearSky',
    'few clouds': 'fewClouds',
    'scattered clouds': 'scatteredClouds',
    'broken clouds': 'brokenClouds',
    'shower rain': 'showerRain',
    'rain': 'rain',
    'thunderstorm': 'thunderstorm',
    'snow': 'snow',
    'mist': 'mist',
    'partly cloudy': 'partlyCloudy',
    'cloudy': 'cloudy',
    'overcast': 'overcast',
    'light rain': 'lightRain',
    'heavy rain': 'heavyRain',
    'drizzle': 'drizzle',
  };
  
  const normalizedDescription = description.toLowerCase();
  const translationKey = weatherMap[normalizedDescription];
  
  if (translationKey) {
    return getTranslation(language, translationKey);
  }
  
  // Если точного соответствия нет, ищем частичные совпадения
  for (const [english, key] of Object.entries(weatherMap)) {
    if (normalizedDescription.includes(english) || english.includes(normalizedDescription)) {
      return getTranslation(language, key);
    }
  }
  
  // Если перевод не найден, возвращаем оригинальное описание
  return description;
}

// Функция для форматирования названия места
export function formatLocationName(locationName: string, language: SupportedLanguage): string {
  if (locationName.toLowerCase() === 'current location' || 
      locationName.toLowerCase() === 'текущее местоположение' ||
      locationName === 'auto') {
    return getTranslation(language, 'currentLocation');
  }
  
  return locationName;
}

// Функция для форматирования дня недели
export function formatDayOfWeek(dateString: string, language: SupportedLanguage): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Проверяем, это сегодня или завтра
  if (date.toDateString() === today.toDateString()) {
    return getTranslation(language, 'today');
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return getTranslation(language, 'tomorrow');
  }
  
  // Массивы дней недели для разных языков
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  const dayIndex = date.getDay();
  
  switch (language) {
    case 'ru':
      return daysRu[dayIndex];
    case 'en':
    default:
      return daysEn[dayIndex];
  }
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
  if (typeof temp !== 'number' || isNaN(temp)) {
    console.warn('formatTemperature: invalid temperature value:', temp);
    return '--°';
  }
  
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
