import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TimerForm = ({ addTimer, darkMode }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Workout'); // Default to 'Workout'
  const [warning, setWarning] = useState(''); // State to handle warning message

  // Add a new timer
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
      setWarning(''); // Clear warning after adding timer
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
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
      >
        <Picker.Item label="Workout" value="Workout" />
        <Picker.Item label="Study" value="Study" />
        <Picker.Item label="Break" value="Break" />
        {/* Add more categories as needed */}
      </Picker>

      {warning ? <Text style={styles.warningText}>{warning}</Text> : null}

      <Button title="Add Timer" onPress={handleAddTimer} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
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
  picker: {
    height: 40, // Reduce height
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
  },
  
  warningText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default TimerForm;
