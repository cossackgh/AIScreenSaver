import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, Animated, Dimensions, StyleSheet } from 'react-native';
import { BackgroundImage, Settings } from '../../types';
import { imageService } from '../../services/imageService';

interface BackgroundSliderProps {
  settings: Settings;
}

const { width, height } = Dimensions.get('window');

export const BackgroundSlider: React.FC<BackgroundSliderProps> = ({ settings }) => {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Анимированные значения для эффектов перехода
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadImages();
  }, [settings.imageRepository]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        changeImage();
      }, settings.imageChangeInterval * 60 * 1000); // конвертируем минуты в миллисекунды

      return () => clearInterval(interval);
    }
  }, [images, currentImageIndex, settings.imageChangeInterval]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const newImages = await imageService.getImagesFromRepository(settings.imageRepository, 10);
      const preloadedImages = await imageService.preloadImages(newImages);
      setImages(preloadedImages);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeImage = () => {
    if (images.length <= 1) return;

    const nextIndex = (currentImageIndex + 1) % images.length;
    
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
  };

  const performFadeTransition = (nextIndex: number) => {
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
  };

  const performSlideTransition = (nextIndex: number) => {
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
  };

  const performZoomTransition = (nextIndex: number) => {
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
  };

  const performFlipTransition = (nextIndex: number) => {
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
  };

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

  if (loading || images.length === 0) {
    return (
      <View style={styles.defaultBackground}>
        {/* Градиентный фон по умолчанию */}
      </View>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <Animated.View style={[styles.container, getTransformStyle()]}>
      <ImageBackground
        source={{ uri: currentImage.url }}
        style={styles.backgroundImage}
        resizeMode="cover"
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
