import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '../types';
import { settingsService } from '../services/settingsService';

interface SettingsContextType {
  settings: Settings | null;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await settingsService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!settings) return;
    
    try {
      await settingsService.saveSettings(newSettings);
      setSettings({ ...settings, ...newSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    try {
      await settingsService.resetSettings();
      await loadSettings();
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
