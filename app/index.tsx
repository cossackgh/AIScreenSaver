import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreensaverScreen } from '../components/screensaver/ScreensaverScreen';
import { SettingsScreen } from '../components/settings/SettingsScreen';

export default function RootScreen() {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleBackPress = () => {
    setShowSettings(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {showSettings ? (
        <SettingsScreen onBack={handleBackPress} />
      ) : (
        <ScreensaverScreen onSettingsPress={handleSettingsPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
