import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerForm from './TimerForm';
import TimerList from './TimerList';

const HomeScreen = ({ darkMode }) => {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem('timers');
        if (savedTimers) {
          setTimers(JSON.parse(savedTimers));
        }
      } catch (error) {
        console.error('Error loading timers:', error);
      }
    };
    loadTimers();
  }, []);

  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem('timers', JSON.stringify(timers));
      } catch (error) {
        console.error('Error saving timers:', error);
      }
    };
    saveTimers();
  }, [timers]);

  const addTimer = (name, duration, category) => {
    const newTimer = {
      id: Math.random().toString(),
      name,
      duration: parseInt(duration),
      originalDuration: parseInt(duration),
      category,
      remainingTime: parseInt(duration),
      status: 'Paused',
    };
    setTimers([...timers, newTimer]);
  };

  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      setTimers([]);
      console.log('All timers cleared.');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <TimerForm addTimer={addTimer} darkMode={darkMode} />
      <TimerList timers={timers} setTimers={setTimers} darkMode={darkMode} />

      <TouchableOpacity style={styles.clearButton} onPress={clearData}>
  <Text style={styles.clearButtonText}>Clear All Data</Text>
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
    backgroundColor: '#f9f9f9',
  },
  clearButton: {
    backgroundColor: '#FF4D4D', // Red background
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 5, // Rounded corners
    alignItems: 'center', // Center the text
    marginTop: 20, // Space above the button
    marginBottom: -10,
  },
  clearButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
  },
});

export default HomeScreen;
