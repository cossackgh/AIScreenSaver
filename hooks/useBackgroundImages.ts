import { useState, useEffect, useCallback } from 'react';
import { BackgroundImage, Settings } from '../types';
import { imageService } from '../services/imageService';

interface UseBackgroundImagesResult {
  images: BackgroundImage[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  nextImage: () => void;
  prevImage: () => void;
  reloadImages: () => void;
}

export const useBackgroundImages = (settings: Settings): UseBackgroundImagesResult => {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newImages = await imageService.getImagesFromRepository(
        settings.imageRepository,
        10
      );
      
      if (newImages.length === 0) {
        throw new Error('No images found in repository');
      }
      
      const preloadedImages = await imageService.preloadImages(newImages);
      setImages(preloadedImages);
      setCurrentIndex(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load images';
      setError(errorMessage);
      console.error('Error loading background images:', err);
    } finally {
      setLoading(false);
    }
  }, [settings.imageRepository]);

  const nextImage = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

  const reloadImages = useCallback(() => {
    loadImages();
  }, [loadImages]);

  // Load images when settings change
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Auto-advance images
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        nextImage();
      }, settings.imageChangeInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [images.length, settings.imageChangeInterval, nextImage]);

  return {
    images,
    currentIndex,
    loading,
    error,
    nextImage,
    prevImage,
    reloadImages,
  };
};
