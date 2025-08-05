import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { imageService } from '../../services/imageService';
import { BackgroundImage, Settings } from '../../types';

interface BackgroundSliderProps {
  settings: Settings;
}

const { width, height } = Dimensions.get('window');

export const BackgroundSlider: React.FC<BackgroundSliderProps> = ({ settings }) => {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentShuffledIndex, setCurrentShuffledIndex] = useState(0);
  
  // Анимированные значения для эффектов перехода
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Функция для создания перемешанного массива индексов
  const createShuffledIndices = useCallback((length: number) => {
    const indices = Array.from({ length }, (_, i) => i);
    // Перемешиваем массив по алгоритму Фишера-Йетса
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, []);

  const loadImages = useCallback(async () => {
    console.log('🖼️ [BackgroundSlider] Начинаем загрузку изображений...');
    console.log('🖼️ [BackgroundSlider] Репозиторий:', settings.imageRepository);
    
    try {
      setLoading(true);
      const newImages = await imageService.getImagesFromRepository(settings.imageRepository, 10);
      console.log('🖼️ [BackgroundSlider] Получено изображений:', newImages.length);
      
      if (newImages.length > 0) {
        console.log('🖼️ [BackgroundSlider] Первое изображение:', newImages[0]);
        const preloadedImages = await imageService.preloadImages(newImages);
        console.log('🖼️ [BackgroundSlider] Изображения предзагружены:', preloadedImages.filter(img => img.loaded).length);
        setImages(preloadedImages);
        setCurrentImageIndex(0);
        
        // Создаем перемешанный массив индексов для случайного порядка
        if (settings.imageDisplayOrder === 'random') {
          const shuffled = createShuffledIndices(preloadedImages.length);
          setShuffledIndices(shuffled);
          setCurrentShuffledIndex(0);
        } else {
          setShuffledIndices([]);
          setCurrentShuffledIndex(0);
        }
      } else {
        console.warn('🖼️ [BackgroundSlider] Изображения не получены, используем пустой массив');
        setImages([]);
      }
    } catch (error) {
      console.error('❌ [BackgroundSlider] Ошибка загрузки изображений:', error);
      setImages([]);
    } finally {
      setLoading(false);
      console.log('🖼️ [BackgroundSlider] Загрузка завершена');
    }
  }, [settings.imageRepository]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Пересоздаем перемешанный массив при изменении настройки порядка отображения
  useEffect(() => {
    if (images.length > 0) {
      if (settings.imageDisplayOrder === 'random') {
        const shuffled = createShuffledIndices(images.length);
        setShuffledIndices(shuffled);
        setCurrentShuffledIndex(0);
      } else {
        setShuffledIndices([]);
        setCurrentShuffledIndex(0);
      }
    }
  }, [settings.imageDisplayOrder, images.length, createShuffledIndices]);

  const performFadeTransition = useCallback((nextIndex: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentImageIndex(nextIndex);
    }, 1000);
  }, [fadeAnim]);

  const performSlideTransition = useCallback((nextIndex: number) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentImageIndex(nextIndex);
    }, 500);
  }, [slideAnim]);

  const performZoomTransition = useCallback((nextIndex: number) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentImageIndex(nextIndex);
    }, 1000);
  }, [scaleAnim]);

  const performFlipTransition = useCallback((nextIndex: number) => {
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setCurrentImageIndex(nextIndex);
    }, 800);
  }, [flipAnim]);

  const changeImage = useCallback(() => {
    if (images.length <= 1) return;

    let nextIndex: number;
    
    if (settings.imageDisplayOrder === 'random') {
      // Случайный порядок - используем перемешанный массив индексов
      const nextShuffledIndex = (currentShuffledIndex + 1) % shuffledIndices.length;
      nextIndex = shuffledIndices[nextShuffledIndex];
      setCurrentShuffledIndex(nextShuffledIndex);
      
      // Если дошли до конца перемешанного массива, создаем новый
      if (nextShuffledIndex === 0) {
        const newShuffled = createShuffledIndices(images.length);
        setShuffledIndices(newShuffled);
      }
    } else {
      // Последовательный порядок
      nextIndex = (currentImageIndex + 1) % images.length;
    }
    
    switch (settings.imageTransitionEffect) {
      case 'fade':
        performFadeTransition(nextIndex);
        break;
      case 'slide':
        performSlideTransition(nextIndex);
        break;
      case 'zoom':
        performZoomTransition(nextIndex);
        break;
      case 'flip':
        performFlipTransition(nextIndex);
        break;
      default:
        setCurrentImageIndex(nextIndex);
    }
  }, [
    images.length, 
    currentImageIndex, 
    currentShuffledIndex,
    shuffledIndices,
    settings.imageTransitionEffect, 
    settings.imageDisplayOrder,
    performFadeTransition, 
    performSlideTransition, 
    performZoomTransition, 
    performFlipTransition,
    createShuffledIndices
  ]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        changeImage();
      }, settings.imageChangeInterval * 60 * 1000); // конвертируем минуты в миллисекунды

      return () => clearInterval(interval);
    }
  }, [images.length, changeImage, settings.imageChangeInterval]);

  const getTransformStyle = () => {
    switch (settings.imageTransitionEffect) {
      case 'fade':
        return { opacity: fadeAnim };
      case 'slide':
        return { transform: [{ translateX: slideAnim }] };
      case 'zoom':
        return { transform: [{ scale: scaleAnim }] };
      case 'flip':
        return {
          transform: [
            {
              rotateY: flipAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  if (loading) {
    console.log('🖼️ [BackgroundSlider] Показываем загрузку...');
    return (
      <View style={styles.defaultBackground}>
        {/* Градиентный фон по умолчанию */}
      </View>
    );
  }

  if (images.length === 0) {
    console.warn('🖼️ [BackgroundSlider] Нет изображений, показываем фон по умолчанию');
    return (
      <View style={styles.defaultBackground}>
        {/* Градиентный фон по умолчанию */}
      </View>
    );
  }

  const currentImage = images[currentImageIndex];
  
  if (!currentImage || !currentImage.url) {
    console.warn('🖼️ [BackgroundSlider] Текущее изображение некорректно:', currentImage);
    return (
      <View style={styles.defaultBackground}>
        {/* Градиентный фон по умолчанию */}
      </View>
    );
  }

  console.log('🖼️ [BackgroundSlider] Рендерим изображение:', currentImage.filename, 'URL:', currentImage.url);

  return (
    <Animated.View style={[styles.container, getTransformStyle()]}>
      <ImageBackground
        source={{ uri: currentImage.url }}
        style={styles.backgroundImage}
        resizeMode="cover"
        onError={(error) => {
          console.error('❌ [BackgroundSlider] Ошибка загрузки изображения:', error.nativeEvent?.error);
          console.error('❌ [BackgroundSlider] Проблемное изображение:', currentImage.url);
        }}
        onLoad={() => {
          console.log('✅ [BackgroundSlider] Изображение успешно загружено:', currentImage.filename);
        }}
      >
        <View style={styles.overlay} />
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Легкое затемнение для лучшей читаемости текста
  },
  defaultBackground: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Темно-синий градиент по умолчанию
  },
});
