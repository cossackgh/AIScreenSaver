import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { imageService } from '../services/imageService';
import { BackgroundImage } from '../types';

const GitHubImageTest = () => {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGitHubImages = async () => {
    const testUrl = 'https://github.com/cossackgh/screen-wallpapers/tree/262c161ca691d218d86c1f7bcb0fd4afa3cf40e1/Arts';
    
    setLoading(true);
    setImages([]);
    setLogs([]);
    
    addLog('🧪 Начинаем тест загрузки изображений из GitHub');
    addLog(`🧪 URL: ${testUrl}`);
    
    try {
      const result = await imageService.getImagesFromRepository(testUrl, 5);
      addLog(`🧪 Получено изображений: ${result.length}`);
      
      if (result.length > 0) {
        setImages(result);
        result.forEach((img, i) => {
          addLog(`🧪 ${i + 1}. ${img.filename}`);
        });
      } else {
        addLog('❌ Изображения не найдены');
      }
    } catch (error) {
      addLog(`❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  const testPicsum = async () => {
    setLoading(true);
    setImages([]);
    setLogs([]);
    
    addLog('🧪 Тестируем Picsum (для сравнения)');
    
    try {
      const result = await imageService.getImagesFromRepository('picsum', 3);
      addLog(`🧪 Получено изображений: ${result.length}`);
      setImages(result);
    } catch (error) {
      addLog(`❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>GitHub Images Test</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testGitHubImages}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Загружаем...' : 'Тест GitHub Images'}
          </Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testPicsum}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Загружаем...' : 'Тест Picsum (контроль)'}
          </Text>
        </Pressable>
      </View>
      
      {/* Логи */}
      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Логи:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </View>
      
      {/* Изображения */}
      {images.length > 0 && (
        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>Результат ({images.length} изображений):</Text>
          {images.map((img, index) => (
            <View key={index} style={styles.imageItem}>
              <Text style={styles.imageFilename}>{img.filename}</Text>
              <Image 
                source={{ uri: img.url }} 
                style={styles.image}
                onLoad={() => addLog(`✅ Изображение загружено: ${img.filename}`)}
                onError={(error) => addLog(`❌ Ошибка загрузки изображения: ${img.filename} - ${error.nativeEvent?.error}`)}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  logsContainer: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    maxHeight: 200,
  },
  logsTitle: {
    color: '#00ff00',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  imagesContainer: {
    marginTop: 20,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imageItem: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageFilename: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
});

export default GitHubImageTest;
