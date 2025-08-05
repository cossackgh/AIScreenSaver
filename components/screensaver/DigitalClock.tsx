import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Settings } from '../../types';
import { formatDate, SupportedLanguage } from '../../utils/localization';

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

  const getFormattedDate = (): string => {
    return formatDate(currentTime, settings.language as SupportedLanguage);
  };

  const getTimeComponents = () => {
    const hours = settings.timeFormat === '12h' 
      ? currentTime.getHours() % 12 || 12 
      : currentTime.getHours();
    
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const ampm = settings.timeFormat === '12h' 
      ? (currentTime.getHours() >= 12 ? 'PM' : 'AM')
      : '';

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes}`;
    
    return { timeString, seconds, ampm };
  };

  const { timeString, seconds, ampm } = getTimeComponents();

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={[
          styles.timeText,
          {
            fontSize: settings.clockFontSize,
            color: settings.clockColor,
            opacity: settings.clockOpacity,
          }
        ]}>
          {timeString}
        </Text>
        
        {settings.showSeconds && (
          <Text style={[
            styles.secondsText,
            {
              fontSize: settings.clockFontSize / 3,
              color: settings.clockColor,
              opacity: settings.clockOpacity * 0.8,
            }
          ]}>
            {seconds}
          </Text>
        )}
        
        {ampm && (
          <Text style={[
            styles.ampmText,
            {
              fontSize: settings.clockFontSize / 4,
              color: settings.clockColor,
              opacity: settings.clockOpacity * 0.9,
            }
          ]}>
            {ampm}
          </Text>
        )}
      </View>
      
      {settings.showDate && (
        <Text style={[
          styles.dateText,
          {
            fontSize: settings.dateFontSize,
          }
        ]}>
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 300, // Базовый размер, будет переопределен в компоненте
    fontWeight: 'bold',
    color: 'white', // Базовый цвет, будет переопределен в компоненте
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 4,
    fontFamily: 'monospace',
  },
  secondsText: {
    fontSize: 100, // Базовый размер, будет переопределен в компоненте (fontSize/3)
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
    fontFamily: 'monospace',
    marginLeft: 10,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  ampmText: {
    fontSize: 75, // Базовый размер, будет переопределен в компоненте (fontSize/4)
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
    fontFamily: 'monospace',
    marginLeft: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  dateText: {
    fontSize: 44, // Базовый размер, будет переопределен в компоненте
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
