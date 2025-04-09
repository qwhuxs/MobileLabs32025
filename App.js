import React, { useState, useRef } from 'react';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  NavigationContainer
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

// GameScreen з tap, double tap, long press
function GameScreen() {
  const [score, setScore] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;

  const animatePulse = () => {
    pulse.setValue(1);
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleTap = () => {
    setScore(prev => prev + 1);
    animatePulse();
    Vibration.vibrate(30);
  };

  const handleDoubleTap = () => {
    setScore(prev => prev + 2);
    animatePulse();
    Vibration.vibrate(50);
  };

  const handleLongPress = () => {
    setScore(prev => prev + 5);
    animatePulse();
    Vibration.vibrate(200);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 28, textAlign: 'center' }}>Очки: {score}</Text>
      <LongPressGestureHandler onActivated={handleLongPress} minDurationMs={3000}>
        <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
          <TapGestureHandler onActivated={handleTap}>
            <Animated.View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#007aff',
                alignSelf: 'center',
                marginTop: 40,
                transform: [{ scale: pulse }],
              }}
            />
          </TapGestureHandler>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </View>
  );
}

function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text>Завдання</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="Гра"
            component={GameScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="sports-esports" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Завдання"
            component={TasksScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="checklist" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f7',
  },
});
