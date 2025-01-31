import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const HistoryScreen = ({ darkMode }) => {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem('timers');
        if (savedTimers) {
          setTimers(JSON.parse(savedTimers));
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };
    loadHistory();
  }, []);

  const exportHistory = async () => {
    try {
      const json = JSON.stringify(timers, null, 2);
      const fileUri = FileSystem.documentDirectory + 'timer_history.json';
      await FileSystem.writeAsStringAsync(fileUri, json);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Timer History',
        UTI: 'public.json'
      });
    } catch (error) {
      console.error('Error exporting history:', error);
      alert('Failed to export timer history.');
    }
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, darkMode ? styles.darkTitle : styles.lightTitle]}>Timer History</Text>
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <View style={[styles.item, darkMode ? styles.darkItem : styles.lightItem]}>
            <Text style={[styles.itemText, darkMode ? styles.darkItemText : styles.lightItemText]}>
              {item.name} - {item.duration}s
            </Text>
            <Text style={[styles.categoryText, darkMode ? styles.darkCategoryText : styles.lightCategoryText]}>
              Category: {item.category}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
  style={[styles.exportButton, { backgroundColor: darkMode ? '#BB86FC' : '#6200ee' }]}
  onPress={exportHistory}
>
  <Text style={styles.exportButtonText}>Export Timer History</Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkTitle: {
    color: '#ffffff',
  },
  lightTitle: {
    color: '#333',
  },
  exportButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  exportButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
  },
  item: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkItem: {
    backgroundColor: '#1e1e1e',
  },
  lightItem: {
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
  },
  darkItemText: {
    color: '#ffffff',
  },
  lightItemText: {
    color: '#333',
  },
  categoryText: {
    fontSize: 14,
    marginTop: 5,
    opacity: 0.8,
  },
  darkCategoryText: {
    color: '#cccccc',
  },
  lightCategoryText: {
    color: '#666',
  },
});

export default HistoryScreen;