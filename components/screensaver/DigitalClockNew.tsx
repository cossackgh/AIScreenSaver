import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Settings } from '../../types';
import { formatTime, formatDate, SupportedLanguage } from '../../utils/localization';

interface DigitalClockProps {
  settings: Settings;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({ settings }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = (): string => {
    return formatTime(currentTime, settings.language as SupportedLanguage, settings.timeFormat, settings.showSeconds);
  };

  const getFormattedDate = (): string => {
    return formatDate(currentTime, settings.language as SupportedLanguage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>
        {getFormattedTime()}
      </Text>
      
      {settings.showDate && (
        <Text style={styles.dateText}>
          {getFormattedDate()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 4,
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
    opacity: 0.9,
  },
});
