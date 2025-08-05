import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Settings } from '../../types';
import { settingsService } from '../../services/settingsService';
import { keepAwakeUtils } from '../../utils/keepAwakeUtils';
import { BackgroundSlider } from './BackgroundSlider';
import { DigitalClock } from './DigitalClock';
import { WeatherWidget } from './WeatherWidget';

interface ScreensaverScreenProps {
  onSettingsPress: () => void;
}

export const ScreensaverScreen: React.FC<ScreensaverScreenProps> = ({ onSettingsPress }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Keep awake функция работает только на мобильных платформах
    if (settings?.keepScreenOn) {
      keepAwakeUtils.activate();
    } else {
      keepAwakeUtils.deactivate();
    }

    return () => {
      keepAwakeUtils.deactivate();
    };
  }, [settings?.keepScreenOn]);

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        {/* Можно добавить индикатор загрузки */}
      </View>
    );
  }

  return (
    <Pressable style={styles.container} onPress={onSettingsPress}>
      <StatusBar hidden />
      
      {/* Фоновые изображения с эффектами перехода */}
      <BackgroundSlider settings={settings} />
      
      {/* Основной контент */}
      <View style={styles.contentContainer}>
        {/* Левая часть - Часы */}
        <View style={styles.clockContainer}>
          <DigitalClock settings={settings} />
        </View>
        
        {/* Правая часть - Погода */}
        <View style={styles.weatherContainer}>
          <WeatherWidget settings={settings} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  clockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  weatherContainer: {
    width: 350,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
  },
});
