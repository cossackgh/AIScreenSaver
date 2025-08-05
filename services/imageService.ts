import { BackgroundImage } from '../types';

// Поддерживаемые типы репозиториев изображений
type RepositoryType = 'picsum' | 'unsplash' | 'local' | 'github' | 'custom';

export const imageService = {
  async getImagesFromRepository(repositoryUrl: string, count: number = 10): Promise<BackgroundImage[]> {
    console.log('🖼️ [ImageService] Загрузка изображений из:', repositoryUrl);
    console.log('🖼️ [ImageService] Количество изображений:', count);
    
    try {
      const repositoryType = this.detectRepositoryType(repositoryUrl);
      console.log('🖼️ [ImageService] Тип репозитория:', repositoryType);
      
      let images: BackgroundImage[] = [];
      
      switch (repositoryType) {
        case 'picsum':
          images = await this.getImagesFromPicsum(count);
          break;
        case 'unsplash':
          images = await this.getImagesFromUnsplash(repositoryUrl, count);
          break;
        case 'github':
          images = await this.getImagesFromGitHub(repositoryUrl, count);
          break;
        case 'local':
          images = await this.getImagesFromLocal(repositoryUrl, count);
          break;
        case 'custom':
          images = await this.getImagesFromCustomAPI(repositoryUrl, count);
          break;
        default:
          console.warn(`Unknown repository type for: ${repositoryUrl}`);
          images = await this.getImagesFromPicsum(count); // Fallback to Picsum
      }
      
      console.log('🖼️ [ImageService] Загружено изображений:', images.length);
      console.log('🖼️ [ImageService] Список изображений:', images.map(img => ({ url: img.url, filename: img.filename })));
      
      return images;
    } catch (error) {
      console.error('❌ [ImageService] Ошибка загрузки изображений:', error);
      const fallbackImages = await this.getImagesFromPicsum(count); // Fallback
      console.log('🖼️ [ImageService] Используем Picsum fallback, изображений:', fallbackImages.length);
      return fallbackImages;
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
    console.log('🐙 [GitHub] Обработка GitHub URL:', repositoryUrl);
    
    try {
      let apiUrl: string;
      
      // Парсим различные форматы GitHub URL
      if (repositoryUrl.includes('/tree/')) {
        // URL вида: https://github.com/user/repo/tree/commit/path
        const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)/);
        if (match) {
          const [, owner, repo, ref, path] = match;
          apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;
          console.log('🐙 [GitHub] Parsed tree URL - Owner:', owner, 'Repo:', repo, 'Ref:', ref, 'Path:', path);
        } else {
          throw new Error('Неверный формат GitHub URL с tree');
        }
      } else if (repositoryUrl.includes('/blob/')) {
        // URL вида: https://github.com/user/repo/blob/commit/path
        const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
        if (match) {
          const [, owner, repo, ref, path] = match;
          // Для blob URL берем родительскую папку
          const parentPath = path.split('/').slice(0, -1).join('/');
          apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${parentPath}?ref=${ref}`;
          console.log('🐙 [GitHub] Parsed blob URL - Owner:', owner, 'Repo:', repo, 'Ref:', ref, 'Parent Path:', parentPath);
        } else {
          throw new Error('Неверный формат GitHub URL с blob');
        }
      } else {
        // Простой URL вида: https://github.com/user/repo
        const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          const [, owner, repo] = match;
          apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
          console.log('🐙 [GitHub] Parsed simple URL - Owner:', owner, 'Repo:', repo);
        } else {
          throw new Error('Неверный формат GitHub URL');
        }
      }
      
      console.log('🐙 [GitHub] API URL:', apiUrl);
      
      // Получаем список файлов из репозитория
      const response = await fetch(apiUrl);
      console.log('🐙 [GitHub] API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🐙 [GitHub] API Error Response:', errorText);
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
      }
      
      const files = await response.json();
      console.log('🐙 [GitHub] Files received:', files.length);
      console.log('🐙 [GitHub] File types:', files.map((f: any) => ({ name: f.name, type: f.type })));
      
      // Фильтруем только файлы изображений
      const imageFiles = files.filter((file: any) => {
        const isFile = file.type === 'file';
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
        console.log(`🐙 [GitHub] File ${file.name}: type=${file.type}, isImage=${isImage}`);
        return isFile && isImage;
      });
      
      console.log('🐙 [GitHub] Image files found:', imageFiles.length);
      console.log('🐙 [GitHub] Image files:', imageFiles.map((f: any) => f.name));
      
      if (imageFiles.length === 0) {
        console.warn('🐙 [GitHub] Изображения не найдены в указанной папке');
        return [];
      }
      
      // Берем случайные изображения из доступных
      const selectedFiles = imageFiles
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, imageFiles.length));
      
      console.log('🐙 [GitHub] Selected files:', selectedFiles.map((f: any) => f.name));
      
      const images: BackgroundImage[] = [];
      for (const file of selectedFiles) {
        console.log('🐙 [GitHub] Processing file:', file.name, 'download_url:', file.download_url);
        images.push({
          url: file.download_url,
          filename: file.name,
          loaded: false,
        });
      }
      
      console.log('🐙 [GitHub] Final images:', images.length);
      return images;
    } catch (error) {
      console.error('❌ [GitHub] Ошибка загрузки GitHub изображений:', error);
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
