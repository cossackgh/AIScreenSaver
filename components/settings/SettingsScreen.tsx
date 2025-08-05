import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { settingsService } from '../../services/settingsService';
import { Settings } from '../../types';
import { keepAwakeUtils } from '../../utils/keepAwakeUtils';
import {
    SUPPORTED_LANGUAGES,
    SupportedLanguage,
    getTranslation,
    translations
} from '../../utils/localization';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<Settings>();
  const [loading, setLoading] = useState(true);
  const keepAwakeSupported = keepAwakeUtils.isSupported();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await settingsService.getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await settingsService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const t = (key: keyof typeof translations.en): string => {
    if (!settings) return key;
    return getTranslation(settings.language as SupportedLanguage, key);
  };

  if (loading || !settings) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {t('screensaver')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Время и дата */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('time')}</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('language')}</Text>
            <View style={styles.pickerContainer}>
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.languageButton,
                    settings.language === code && styles.languageButtonActive
                  ]}
                  onPress={() => updateSetting('language', code)}
                >
                  <Text style={[
                    styles.languageButtonText,
                    settings.language === code && styles.languageButtonTextActive
                  ]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('timeFormat')}</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, settings.timeFormat === '12h' && styles.toggleOptionActive]}
                onPress={() => updateSetting('timeFormat', '12h')}
              >
                <Text style={[styles.toggleText, settings.timeFormat === '12h' && styles.toggleTextActive]}>
                  12h
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, settings.timeFormat === '24h' && styles.toggleOptionActive]}
                onPress={() => updateSetting('timeFormat', '24h')}
              >
                <Text style={[styles.toggleText, settings.timeFormat === '24h' && styles.toggleTextActive]}>
                  24h
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('showSeconds')}</Text>
            <Switch
              value={settings.showSeconds}
              onValueChange={(value) => updateSetting('showSeconds', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.showSeconds ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('showDate')}</Text>
            <Switch
              value={settings.showDate}
              onValueChange={(value) => updateSetting('showDate', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.showDate ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Внешний вид */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('clockFontSize')} ({settings.clockFontSize}px)</Text>
            <View style={styles.sliderContainer}>
              {[200, 250, 300, 350, 400].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.intervalButton,
                    settings.clockFontSize === size && styles.intervalButtonActive
                  ]}
                  onPress={() => updateSetting('clockFontSize', size)}
                >
                  <Text style={[
                    styles.intervalButtonText,
                    settings.clockFontSize === size && styles.intervalButtonTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('dateFontSize')} ({settings.dateFontSize}px)</Text>
            <View style={styles.sliderContainer}>
              {[28, 32, 36, 40, 44, 48].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.intervalButton,
                    settings.dateFontSize === size && styles.intervalButtonActive
                  ]}
                  onPress={() => updateSetting('dateFontSize', size)}
                >
                  <Text style={[
                    styles.intervalButtonText,
                    settings.dateFontSize === size && styles.intervalButtonTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('clockColor')}</Text>
            <View style={styles.colorContainer}>
              {['#ffffff', '#ffff00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    settings.clockColor === color && styles.colorButtonActive
                  ]}
                  onPress={() => updateSetting('clockColor', color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('clockOpacity')} ({Math.round(settings.clockOpacity * 100)}%)</Text>
            <View style={styles.sliderContainer}>
              {[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((opacity) => (
                <TouchableOpacity
                  key={opacity}
                  style={[
                    styles.intervalButton,
                    Math.abs(settings.clockOpacity - opacity) < 0.01 && styles.intervalButtonActive
                  ]}
                  onPress={() => updateSetting('clockOpacity', opacity)}
                >
                  <Text style={[
                    styles.intervalButtonText,
                    Math.abs(settings.clockOpacity - opacity) < 0.01 && styles.intervalButtonTextActive
                  ]}>
                    {Math.round(opacity * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Погода */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('weather')}</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('weatherEnabled')}</Text>
            <Switch
              value={settings.weatherEnabled}
              onValueChange={(value) => updateSetting('weatherEnabled', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.weatherEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('temperatureUnit')}</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, settings.temperatureUnit === 'celsius' && styles.toggleOptionActive]}
                onPress={() => updateSetting('temperatureUnit', 'celsius')}
              >
                <Text style={[styles.toggleText, settings.temperatureUnit === 'celsius' && styles.toggleTextActive]}>
                  {t('celsius')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, settings.temperatureUnit === 'fahrenheit' && styles.toggleOptionActive]}
                onPress={() => updateSetting('temperatureUnit', 'fahrenheit')}
              >
                <Text style={[styles.toggleText, settings.temperatureUnit === 'fahrenheit' && styles.toggleTextActive]}>
                  {t('fahrenheit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('showForecast')}</Text>
            <Switch
              value={settings.showForecast}
              onValueChange={(value) => updateSetting('showForecast', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.showForecast ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('forecastDays')}</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, settings.forecastDays === 3 && styles.toggleOptionActive]}
                onPress={() => updateSetting('forecastDays', 3)}
              >
                <Text style={[styles.toggleText, settings.forecastDays === 3 && styles.toggleTextActive]}>
                  3 {t('days')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, settings.forecastDays === 5 && styles.toggleOptionActive]}
                onPress={() => updateSetting('forecastDays', 5)}
              >
                <Text style={[styles.toggleText, settings.forecastDays === 5 && styles.toggleTextActive]}>
                  5 {t('days')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Фоновые изображения */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('background')}</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('imageRepository')}</Text>
            <TextInput
              style={styles.textInput}
              value={settings.imageRepository}
              onChangeText={(text) => updateSetting('imageRepository', text)}
              placeholder="https://example.com"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('transitionEffect')}</Text>
            <View style={styles.effectContainer}>
              {['fade', 'slide', 'zoom', 'flip'].map((effect) => (
                <TouchableOpacity
                  key={effect}
                  style={[
                    styles.effectButton,
                    settings.imageTransitionEffect === effect && styles.effectButtonActive
                  ]}
                  onPress={() => updateSetting('imageTransitionEffect', effect as any)}
                >
                  <Text style={[
                    styles.effectButtonText,
                    settings.imageTransitionEffect === effect && styles.effectButtonTextActive
                  ]}>
                    {effect}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              {t('changeInterval')} ({settings.imageChangeInterval} {t('minutes')})
            </Text>
            <View style={styles.sliderContainer}>
              {[1, 3, 5, 10, 15, 30].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.intervalButton,
                    settings.imageChangeInterval === minutes && styles.intervalButtonActive
                  ]}
                  onPress={() => updateSetting('imageChangeInterval', minutes)}
                >
                  <Text style={[
                    styles.intervalButtonText,
                    settings.imageChangeInterval === minutes && styles.intervalButtonTextActive
                  ]}>
                    {minutes}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t('imageDisplayOrder')}</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, settings.imageDisplayOrder === 'sequential' && styles.toggleOptionActive]}
                onPress={() => updateSetting('imageDisplayOrder', 'sequential')}
              >
                <Text style={[styles.toggleText, settings.imageDisplayOrder === 'sequential' && styles.toggleTextActive]}>
                  {t('sequential')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, settings.imageDisplayOrder === 'random' && styles.toggleOptionActive]}
                onPress={() => updateSetting('imageDisplayOrder', 'random')}
              >
                <Text style={[styles.toggleText, settings.imageDisplayOrder === 'random' && styles.toggleTextActive]}>
                  {t('random')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Общие настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('general')}</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('keepScreenOn')}</Text>
              {!keepAwakeSupported && (
                <Text style={styles.settingNote}>{t('notSupportedOnWeb')}</Text>
              )}
            </View>
            <Switch
              value={settings.keepScreenOn && keepAwakeSupported}
              onValueChange={(value) => updateSetting('keepScreenOn', value)}
              disabled={!keepAwakeSupported}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.keepScreenOn && keepAwakeSupported ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#4a9eff',
    fontSize: 18,
    fontWeight: '500',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  settingNote: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
  },
  toggleOptionActive: {
    backgroundColor: '#4a9eff',
  },
  toggleText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
  textInput: {
    backgroundColor: '#333',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    minWidth: 200,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  languageButton: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  languageButtonActive: {
    backgroundColor: '#4a9eff',
  },
  languageButtonText: {
    color: '#ccc',
    fontSize: 12,
  },
  languageButtonTextActive: {
    color: 'white',
  },
  effectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  effectButton: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    margin: 2,
  },
  effectButtonActive: {
    backgroundColor: '#4a9eff',
  },
  effectButtonText: {
    color: '#ccc',
    fontSize: 12,
  },
  effectButtonTextActive: {
    color: 'white',
  },
  sliderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  intervalButton: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  intervalButtonActive: {
    backgroundColor: '#4a9eff',
  },
  intervalButtonText: {
    color: '#ccc',
    fontSize: 12,
  },
  intervalButtonTextActive: {
    color: 'white',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  colorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    margin: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#4a9eff',
    borderWidth: 3,
  },
});
