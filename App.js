import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import { StyleSheet } from 'react-native';

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
            let iconName = route.name === 'Home' ? 'home' : 'time';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarStyle: [styles.tabBar, darkMode ? styles.darkTabBar : styles.lightTabBar],
          headerTitleAlign: 'center',
          headerLeft: () => <Icon name="logo-react" size={30} style={styles.logo} />,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleDarkMode}
              style={[
                styles.toggleButton,
                { backgroundColor: darkMode ? '#555' : '#eee' }
              ]}
            >
              <Icon
                name={darkMode ? 'moon' : 'sunny'}
                size={20}
                color={darkMode ? '#ffffff' : '#000000'}
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
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 25,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
