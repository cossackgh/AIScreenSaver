import { imageService } from '../services/imageService';

/**
 * Утилиты для тестирования репозиториев изображений
 */
export const imageRepositoryUtils = {
  /**
   * Тестирует доступность репозитория
   */
  async testRepository(repositoryUrl: string): Promise<{
    success: boolean;
    type: string;
    message: string;
    imageCount?: number;
  }> {
    try {
      const type = imageService.detectRepositoryType(repositoryUrl);
      console.log(`Testing repository: ${repositoryUrl} (type: ${type})`);
      
      const images = await imageService.getImagesFromRepository(repositoryUrl, 3);
      
      if (images.length === 0) {
        return {
          success: false,
          type,
          message: 'Repository returned no images',
        };
      }
      
      // Пытаемся загрузить первое изображение для проверки
      const firstImage = images[0];
      const loadSuccess = await imageService.preloadImage(firstImage.url);
      
      if (!loadSuccess) {
        return {
          success: false,
          type,
          message: 'Failed to load test image from repository',
        };
      }
      
      return {
        success: true,
        type,
        message: `Repository is working. Loaded ${images.length} images.`,
        imageCount: images.length,
      };
    } catch (error) {
      return {
        success: false,
        type: 'unknown',
        message: `Error testing repository: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },

  /**
   * Получает информацию о типе репозитория
   */
  getRepositoryInfo(repositoryUrl: string) {
    const type = imageService.detectRepositoryType(repositoryUrl);
    
    const info = {
      picsum: {
        name: 'Picsum Photos',
        description: 'Бесплатный сервис случайных изображений высокого качества',
        requiresSetup: false,
        limitations: 'Нет ограничений для демо использования',
      },
      unsplash: {
        name: 'Unsplash Source',
        description: 'Высококачественные фотографии от профессиональных фотографов',
        requiresSetup: false,
        limitations: 'Ограничения на количество запросов в час',
      },
      github: {
        name: 'GitHub Repository',
        description: 'Ваш собственный репозиторий с изображениями',
        requiresSetup: true,
        limitations: 'Требует публичный репозиторий с изображениями в корне',
      },
      local: {
        name: 'Local Images',
        description: 'Изображения, встроенные в приложение',
        requiresSetup: true,
        limitations: 'Требует добавление изображений в assets и пересборку',
      },
      custom: {
        name: 'Custom API',
        description: 'Пользовательский API для изображений',
        requiresSetup: true,
        limitations: 'Требует правильный формат JSON ответа',
      },
    };
    
    return {
      type,
      ...info[type],
    };
  },

  /**
   * Валидирует URL репозитория
   */
  validateRepositoryUrl(repositoryUrl: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!repositoryUrl || repositoryUrl.trim().length === 0) {
      issues.push('URL репозитория не может быть пустым');
      suggestions.push('Введите один из поддерживаемых URL (например: picsum, unsplash)');
      return { isValid: false, issues, suggestions };
    }
    
    const url = repositoryUrl.trim().toLowerCase();
    const type = imageService.detectRepositoryType(url);
    
    // Валидация для GitHub
    if (type === 'github') {
      if (!url.includes('github.com')) {
        issues.push('GitHub URL должен содержать "github.com"');
        suggestions.push('Используйте формат: https://github.com/username/repository');
      }
      
      const githubMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!githubMatch) {
        issues.push('Неверный формат GitHub URL');
        suggestions.push('Правильный формат: https://github.com/username/repository');
      }
    }
    
    // Валидация для custom API
    if (type === 'custom') {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        issues.push('Custom API URL должен начинаться с http:// или https://');
        suggestions.push('Добавьте протокол в начало URL');
      }
    }
    
    // Общие рекомендации
    if (issues.length === 0) {
      const info = this.getRepositoryInfo(repositoryUrl);
      if (info.requiresSetup) {
        suggestions.push(`Этот тип репозитория (${info.name}) требует дополнительной настройки`);
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    };
  },
};
