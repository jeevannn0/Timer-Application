import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TimerForm from './TimerForm';
import TimerList from './TimerList';
import HistoryScreen from './HistoryScreen';
import Icon from 'react-native-vector-icons/Ionicons';

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
      <Button title="Clear All Data" onPress={clearData}  />
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'History') {
              iconName = 'time';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarStyle: [
            styles.tabBar,
            darkMode ? styles.darkTabBar : styles.lightTabBar,
          ],
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon name="logo-react" size={30} style={styles.logo} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleDarkMode}
              style={{
                backgroundColor: darkMode ? '#555' : '#eee', // Background color based on dark mode
                paddingVertical: 10, // Vertical padding (top and bottom)
                paddingHorizontal: 15, // Horizontal padding for overall spacing
                marginRight: 25, // Margin to the right side
                borderRadius: 5, // Rounded corners
                alignItems: 'center', // Center the icon
                flexDirection: 'row', // Make sure icons align in row
              }}
            >
              <Icon
                name={darkMode ? 'moon' : 'sunny'} // Moon icon for dark mode, Sun icon for light mode
                size={20} // Size of the icon
                color={darkMode ? '#ffffff' : '#000000'} // Icon color based on dark mode
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="Home">
          {() => <HomeScreen darkMode={darkMode} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <HistoryScreen darkMode={darkMode} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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
  darkTabBar: {
    backgroundColor: '#333',
  },
  lightTabBar: {
    backgroundColor: '#fff',
  },
  logo: {
    marginLeft: 35,
  },
  tabBar: {
    height: 60,
  },
});
