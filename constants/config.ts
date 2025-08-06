/**
 * Application constants
 */

export const APP_CONFIG = {
  name: 'AI Screensaver',
  version: '1.0.0',
  author: 'Your Name',
};

export const STORAGE_KEYS = {
  SETTINGS: 'screensaver_settings',
  WEATHER_CACHE: 'weather_cache',
  IMAGE_CACHE: 'image_cache',
};

export const WEATHER_CONFIG = {
  UPDATE_INTERVAL: 30 * 60 * 1000, // 30 minutes
  DEFAULT_LOCATION: 'auto',
  MOCK_DATA: true, // Set to false for production
};

export const IMAGE_CONFIG = {
  DEFAULT_REPOSITORY: 'https://picsum.photos',
  DEFAULT_TRANSITION: 'fade' as const,
  DEFAULT_INTERVAL: 5, // minutes
  PRELOAD_COUNT: 10,
  
  // Примеры поддерживаемых репозиториев
  EXAMPLE_REPOSITORIES: [
    {
      name: 'Picsum Photos',
      url: 'https://picsum.photos',
      description: 'Случайные высококачественные изображения',
      type: 'picsum',
    },
    {
      name: 'Picsum (короткая форма)',
      url: 'picsum',
      description: 'То же что и Picsum Photos',
      type: 'picsum',
    },
    {
      name: 'GitHub репозиторий',
      url: 'https://github.com/username/wallpapers',
      description: 'Ваш собственный репозиторий с изображениями',
      type: 'github',
    },
    {
      name: 'Локальные изображения',
      url: 'local',
      description: 'Изображения, встроенные в приложение',
      type: 'local',
    },
  ],
};

export const THEME = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    error: '#f44336',
    warning: '#ff9800',
    background: '#1a1a2e',
    surface: '#2a2a3e',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textTertiary: 'rgba(255, 255, 255, 0.6)',
  },
  gradients: {
    background: ['#1a1a2e', '#16213e', '#0f3460'],
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
  shadows: {
    text: {
      color: 'rgba(0, 0, 0, 0.8)',
      offset: { width: 2, height: 2 },
      radius: 8,
    },
  },
};

export const ANIMATION_CONFIG = {
  duration: {
    fast: 300,
    medium: 600,
    slow: 1000,
  },
  easing: {
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
};
