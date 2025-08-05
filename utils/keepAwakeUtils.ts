import { Platform } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

/**
 * Platform-safe keep awake utilities
 * expo-keep-awake не работает в веб-версии, поэтому добавляем проверки платформы
 */

export const keepAwakeUtils = {
  /**
   * Активировать режим "не спать" (только для мобильных платформ)
   */
  async activate(): Promise<void> {
    if (Platform.OS !== 'web') {
      try {
        await activateKeepAwakeAsync();
      } catch (error) {
        console.warn('Failed to activate keep awake:', error);
      }
    }
  },

  /**
   * Деактивировать режим "не спать" (только для мобильных платформ)
   */
  deactivate(): void {
    if (Platform.OS !== 'web') {
      try {
        deactivateKeepAwake();
      } catch (error) {
        console.warn('Failed to deactivate keep awake:', error);
      }
    }
  },

  /**
   * Проверить, поддерживается ли keep awake на текущей платформе
   */
  isSupported(): boolean {
    return Platform.OS !== 'web';
  },
};
