import { BackgroundImage } from '../types';

export const imageService = {
  async getImagesFromRepository(repositoryUrl: string, count: number = 10): Promise<BackgroundImage[]> {
    try {
      const images: BackgroundImage[] = [];
      
      // Для демонстрации используем Picsum Photos API
      for (let i = 0; i < count; i++) {
        const imageId = Math.floor(Math.random() * 1000) + 1;
        const url = `https://picsum.photos/1920/1080?random=${imageId}`;
        
        images.push({
          url,
          filename: `image_${imageId}.jpg`,
          loaded: false,
        });
      }
      
      return images;
    } catch (error) {
      console.error('Error fetching images:', error);
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
