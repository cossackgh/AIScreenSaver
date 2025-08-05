export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  forecast?: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

export interface Settings {
  // Время и дата
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  showDate: boolean;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  language: string; // Язык интерфейса (en, ru, de, fr, etc.)
  
  // Настройки отображения часов
  clockFontSize: number; // Размер шрифта часов (в px)
  clockColor: string; // Цвет шрифта часов
  clockOpacity: number; // Прозрачность часов (0-1)
  dateFontSize: number; // Размер шрифта даты (в px)
  
  // Погода
  weatherEnabled: boolean;
  weatherLocation: string;
  showForecast: boolean;
  forecastDays: 3 | 5;
  temperatureUnit: 'celsius' | 'fahrenheit'; // Единицы измерения температуры
  
  // Фоновые изображения
  imageRepository: string;
  imageTransitionEffect: 'fade' | 'slide' | 'zoom' | 'flip';
  imageChangeInterval: number; // в минутах
  
  // Общие настройки
  keepScreenOn: boolean;
}

export interface BackgroundImage {
  url: string;
  filename: string;
  loaded: boolean;
}

export type TransitionEffect = 'fade' | 'slide' | 'zoom' | 'flip';
