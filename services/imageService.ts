import { BackgroundImage } from '../types';

// Поддерживаемые типы репозиториев изображений
type RepositoryType = 'picsum' | 'unsplash' | 'local' | 'github' | 'custom';

export const imageService = {
  async getImagesFromRepository(repositoryUrl: string, count: number = 10): Promise<BackgroundImage[]> {
    try {
      const repositoryType = this.detectRepositoryType(repositoryUrl);
      
      switch (repositoryType) {
        case 'picsum':
          return this.getImagesFromPicsum(count);
        case 'unsplash':
          return this.getImagesFromUnsplash(repositoryUrl, count);
        case 'github':
          return this.getImagesFromGitHub(repositoryUrl, count);
        case 'local':
          return this.getImagesFromLocal(repositoryUrl, count);
        case 'custom':
          return this.getImagesFromCustomAPI(repositoryUrl, count);
        default:
          console.warn(`Unknown repository type for: ${repositoryUrl}`);
          return this.getImagesFromPicsum(count); // Fallback to Picsum
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      return this.getImagesFromPicsum(count); // Fallback
    }
  },

  detectRepositoryType(repositoryUrl: string): RepositoryType {
    const url = repositoryUrl.toLowerCase();
    
    if (url.includes('picsum.photos') || url === 'picsum' || url === 'https://picsum.photos') {
      return 'picsum';
    }
    if (url.includes('unsplash.com') || url.includes('unsplash')) {
      return 'unsplash';
    }
    if (url.includes('github.com') || url.includes('raw.githubusercontent.com')) {
      return 'github';
    }
    if (url.startsWith('file://') || url.startsWith('./') || url.startsWith('../') || url === 'local') {
      return 'local';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return 'custom';
    }
    
    return 'picsum'; // Default fallback
  },

  async getImagesFromPicsum(count: number): Promise<BackgroundImage[]> {
    try {
      const images: BackgroundImage[] = [];
      
      for (let i = 0; i < count; i++) {
        const imageId = Math.floor(Math.random() * 1000) + 1;
        const url = `https://picsum.photos/1920/1080?random=${imageId}`;
        
        images.push({
          url,
          filename: `picsum_${imageId}.jpg`,
          loaded: false,
        });
      }
      
      return images;
    } catch (error) {
      console.error('Error fetching Picsum images:', error);
      return [];
    }
  },

  async getImagesFromUnsplash(repositoryUrl: string, count: number): Promise<BackgroundImage[]> {
    try {
      const images: BackgroundImage[] = [];
      
      // Для демонстрации используем Unsplash Source API
      // В реальном приложении лучше использовать официальный Unsplash API с ключом
      const topics = ['nature', 'landscape', 'space', 'abstract', 'architecture'];
      
      for (let i = 0; i < count; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const url = `https://source.unsplash.com/1920x1080/?${topic}&sig=${Date.now() + i}`;
        
        images.push({
          url,
          filename: `unsplash_${topic}_${i}.jpg`,
          loaded: false,
        });
      }
      
      return images;
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
      return [];
    }
  },

  async getImagesFromGitHub(repositoryUrl: string, count: number): Promise<BackgroundImage[]> {
    try {
      const images: BackgroundImage[] = [];
      
      // Парсим GitHub URL для получения информации о репозитории
      const githubMatch = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!githubMatch) {
        throw new Error('Invalid GitHub repository URL');
      }
      
      const [, owner, repo] = githubMatch;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
      
      // Получаем список файлов из репозитория
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const files = await response.json();
      const imageFiles = files.filter((file: any) => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      );
      
      // Берем случайные изображения из доступных
      const selectedFiles = imageFiles
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, imageFiles.length));
      
      for (const file of selectedFiles) {
        images.push({
          url: file.download_url,
          filename: file.name,
          loaded: false,
        });
      }
      
      return images;
    } catch (error) {
      console.error('Error fetching GitHub images:', error);
      return [];
    }
  },

  async getImagesFromLocal(repositoryUrl: string, count: number): Promise<BackgroundImage[]> {
    try {
      // Для React Native локальные изображения должны быть импортированы статически
      // Создаем список доступных изображений из assets/images/backgrounds/
      const localImages: any[] = [
        // Добавьте ваши локальные изображения в assets/images/backgrounds/
        // require('../assets/images/backgrounds/bg1.jpg'),
        // require('../assets/images/backgrounds/bg2.jpg'),
        // require('../assets/images/backgrounds/bg3.jpg'),
      ];
      
      if (localImages.length === 0) {
        console.warn('No local images found, falling back to Picsum');
        return this.getImagesFromPicsum(count);
      }
      
      const images: BackgroundImage[] = [];
      const selectedImages = localImages
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, localImages.length));
      
      selectedImages.forEach((imageSource, index) => {
        images.push({
          url: imageSource,
          filename: `local_image_${index + 1}.jpg`,
          loaded: false,
        });
      });
      
      return images;
    } catch (error) {
      console.error('Error loading local images:', error);
      // Fallback к Picsum если локальные изображения недоступны
      return this.getImagesFromPicsum(count);
    }
  },

  async getImagesFromCustomAPI(repositoryUrl: string, count: number): Promise<BackgroundImage[]> {
    try {
      // Пытаемся получить JSON список изображений с custom API
      const response = await fetch(`${repositoryUrl}?count=${count}`);
      if (!response.ok) {
        throw new Error(`Custom API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ожидаем, что API вернет массив объектов с полем 'url' или 'image'
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          url: item.url || item.image || item.src,
          filename: item.filename || item.name || `custom_${index + 1}.jpg`,
          loaded: false,
        }));
      }
      
      // Если API возвращает объект с массивом изображений
      if (data.images && Array.isArray(data.images)) {
        return data.images.map((item: any, index: number) => ({
          url: item.url || item.image || item.src,
          filename: item.filename || item.name || `custom_${index + 1}.jpg`,
          loaded: false,
        }));
      }
      
      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('Error fetching custom API images:', error);
      return [];
    }
  },

  async preloadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = url;
    });
  },

  async preloadImages(images: BackgroundImage[]): Promise<BackgroundImage[]> {
    const loadPromises = images.map(async (image) => {
      const loaded = await this.preloadImage(image.url);
      return { ...image, loaded };
    });

    return Promise.all(loadPromises);
  },
};
