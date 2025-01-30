import React, { useState, useEffect } from 'react'; 
import { View, Text, Button, SectionList, TouchableOpacity, StyleSheet, Modal } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bar } from 'react-native-progress'; // Import from react-native-progress

const TimerList = ({ timers, setTimers, darkMode }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [completedTimerName, setCompletedTimerName] = useState(''); // To store completed timer's name

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle the visibility state of the category
    }));
  };

  // Start/stop the timer
  const toggleTimer = (id) => {
    setTimers(timers.map((timer) =>
      timer.id === id
        ? { ...timer, status: timer.status === 'Running' ? 'Paused' : 'Running' }
        : timer
    ));
  };

  // Reset the timer
  const resetTimer = (id) => {
    setTimers(timers.map((timer) =>
      timer.id === id
        ? { ...timer, remainingTime: timer.originalDuration, status: 'Paused' }
        : timer
    ));
  };

  // Start all timers in a category
  const startAllTimers = (category) => {
    setTimers(timers.map((timer) =>
      timer.category === category && timer.status !== 'Completed'
        ? { ...timer, status: 'Running' }
        : timer
    ));
  };

  // Pause all timers in a category
  const pauseAllTimers = (category) => {
    setTimers(timers.map((timer) =>
      timer.category === category && timer.status === 'Running'
        ? { ...timer, status: 'Paused' }
        : timer
    ));
  };

  // Reset all timers in a category
  const resetAllTimers = (category) => {
    setTimers(timers.map((timer) =>
      timer.category === category
        ? { ...timer, remainingTime: timer.originalDuration, status: 'Paused' }
        : timer
    ));
  };

  // Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status === 'Running' && timer.remainingTime > 0) {
            return { ...timer, remainingTime: timer.remainingTime - 1 };
          } else if (timer.status === 'Running' && timer.remainingTime === 0) {
            setCompletedTimerName(timer.name); // Set the completed timer's name
            setModalVisible(true); // Show the modal
            return { ...timer, status: 'Completed' }; // Mark as completed when timer reaches 0
          }
          return timer;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [timers]);

  // Group timers by category
  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const sections = Object.keys(groupedTimers).map((category) => ({
    title: category,
    data: groupedTimers[category],
  }));

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section }) => (
          expandedCategories[section.title] ? (
            <View style={[styles.timerContainer, darkMode ? styles.darkTimerContainer : styles.lightTimerContainer]}>
              <Text style={[styles.timerName, darkMode ? styles.darkTimerName : styles.lightTimerName]}>{item.name}</Text>
              <Text style={[styles.timerText, darkMode ? styles.darkTimerText : styles.lightTimerText]}>Remaining Time: {item.remainingTime}s</Text>
              <Text style={[styles.timerText, darkMode ? styles.darkTimerText : styles.lightTimerText]}>Status: {item.status}</Text>

              {/* Progress Bar with padding on top */}
              <View style={styles.progressContainer}>
                <Bar
                  progress={(item.originalDuration - item.remainingTime) / item.originalDuration}
                  width={200}
                  height={15} // Slightly taller for better visibility
                  color={item.status === 'Running' ? '#29b6f6' : '#ff7043'} // Conditional color based on status
                />
              </View>
              <Text style={styles.progressText}>{Math.round(((item.originalDuration - item.remainingTime) / item.originalDuration) * 100)}%</Text>

              <View style={styles.buttonsContainer}>
                {item.status !== 'Completed' ? (
                  <>
                    <Button title={item.status === 'Running' ? 'Pause' : 'Start'} onPress={() => toggleTimer(item.id)} />
                    <Button title="Reset" onPress={() => resetTimer(item.id)} />
                  </>
                ) : (
                  <Button title="Completed" disabled />
                )}
              </View>
            </View>
          ) : null
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, darkMode ? styles.darkSectionHeader : styles.lightSectionHeader]}>
            <TouchableOpacity onPress={() => toggleCategory(title)}>
              <Text style={[styles.categoryHeader, darkMode ? styles.darkCategoryHeader : styles.lightCategoryHeader]}>
                {title} {expandedCategories[title] ? '-' : '+'}
              </Text>
            </TouchableOpacity>

            {expandedCategories[title] && (
              <View style={styles.categoryActions}>
                <Button title="Start All" onPress={() => startAllTimers(title)} />
                <Button title="Pause All" onPress={() => pauseAllTimers(title)} />
                <Button title="Reset All" onPress={() => resetAllTimers(title)} />
              </View>
            )}
          </View>
        )}
        extraData={expandedCategories}
      />

      {/* Modal for Congratulatory Message */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Congratulations!</Text>
            <Text style={styles.modalText}>Timer '{completedTimerName}' has completed!</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#e1f5fe',
  },
  sectionHeader: {
    padding: 10,
    borderRadius: 5,
  },
  darkSectionHeader: {
    backgroundColor: '#bbdefb',
  },
  lightSectionHeader: {
    backgroundColor: '#bbdefb',
  },
  timerContainer: {
    marginVertical: 15,
    padding: 20, // Increased padding
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  darkTimerContainer: {
    backgroundColor: '#1e1e1e',
  },
  lightTimerContainer: {
    backgroundColor: '#ffffff',
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkTimerName: {
    color: '#ffffff',
  },
  lightTimerName: {
    color: '#1e88e5',
  },
  timerText: {
    fontSize: 14,
  },
  darkTimerText: {
    color: '#ffffff',
  },
  lightTimerText: {
    color: '#555',
  },
  progressContainer: {
    paddingTop: 10, // Add padding on top of the progress bar
    paddingBottom: 10,
  },
  progressText: {
    fontSize: 14,
    marginVertical: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  darkCategoryHeader: {
    color: '#ffffff',
  },
  lightCategoryHeader: {
    color: '#333',
  },
  categoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30, // Increased padding
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20, // Larger modal text
    marginBottom: 15,
  },
});

export default TimerList;