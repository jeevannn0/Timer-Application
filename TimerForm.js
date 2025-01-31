import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

const TimerForm = ({ addTimer, darkMode }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Workout'); // Default to 'Workout'
  const [warning, setWarning] = useState('');

  const handleAddTimer = () => {
    if (!name || !duration || !category) {
      setWarning('Please fill in all fields!');
    } else if (isNaN(duration) || duration <= 0) {
      setWarning('Please enter a valid number for duration!');
    } else {
      addTimer(name, duration, category);
      setName('');
      setDuration('');
      setCategory('Workout'); // Reset category after adding
      setWarning('');
    }
  };

  return (
    <View style={[styles.formContainer, darkMode ? styles.darkFormContainer : styles.lightFormContainer]}>
      <Text style={[styles.label, darkMode ? styles.darkLabel : styles.lightLabel]}>Timer Name</Text>
      <TextInput
        placeholder="Enter Timer Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
      />

      <Text style={[styles.label, darkMode ? styles.darkLabel : styles.lightLabel]}>Duration (seconds)</Text>
      <TextInput
        placeholder="Enter Duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
      />

      <Text style={[styles.label, darkMode ? styles.darkLabel : styles.lightLabel]}>Category</Text>
      <View style={styles.buttonGroup}>
        {['Workout', 'Study', 'Break'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.categoryButton, category === item && styles.selectedCategory]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.buttonText, darkMode ? styles.darkButtonText : styles.lightButtonText]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {warning ? <Text style={styles.warningText}>{warning}</Text> : null}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTimer}>
        <Text style={styles.addButtonText}>Add Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 5,
    borderRadius: 8,
    elevation: 5,
  },
  darkFormContainer: {
    backgroundColor: '#1e1e1e',
  },
  lightFormContainer: {
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 4,
  },
  darkInput: {
    borderColor: '#cccccc',
    backgroundColor: '#333333',
    color: '#ffffff',
  },
  lightInput: {
    borderColor: '#cccccc',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  darkLabel: {
    color: '#ffffff',
  },
  lightLabel: {
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#ffffff',
  },
  lightButtonText: {
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 9,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#388E3C',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  warningText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default TimerForm;
