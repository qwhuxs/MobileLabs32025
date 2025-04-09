import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return <View><Text>Гра</Text></View>;
}

function TasksScreen() {
  return <View><Text>Завдання</Text></View>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Гра" component={HomeScreen} />
        <Tab.Screen name="Завдання" component={TasksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
