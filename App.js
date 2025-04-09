import React, { useState, useRef } from 'react';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  Directions,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigation,
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

function GameScreen() {
  const [score, setScore] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

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

  const handleDrag = () => {
    setScore(prev => prev + 3);
    animatePulse();
    Vibration.vibrate(40);
  };

  const handleFling = (direction) => {
    if (direction === 'right') navigation.goBack();
    else if (direction === 'left') navigation.navigate('NextScreen');

    setScore(prev => prev + Math.floor(Math.random() * 10) + 1);
    animatePulse();
    Vibration.vibrate(60);
  };

  const handlePinch = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    {
      useNativeDriver: true,
      listener: () => {
        setScore(prev => prev + 7);
        animatePulse();
        Vibration.vibrate(70);
      },
    }
  );

  const combinedScale = Animated.multiply(pinchScale, pulse);

  return (
    <FlingGestureHandler
      direction={Directions.RIGHT}
      onActivated={() => handleFling('right')}>
      <FlingGestureHandler
        direction={Directions.LEFT}
        onActivated={() => handleFling('left')}>
        <View style={styles.container}>
          <Text style={{ fontSize: 28, textAlign: 'center' }}>Очки: {score}</Text>
          <LongPressGestureHandler onActivated={handleLongPress} minDurationMs={3000}>
            <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
              <TapGestureHandler onActivated={handleTap}>
                <PinchGestureHandler onGestureEvent={handlePinch}>
                  <PanGestureHandler
                    onGestureEvent={Animated.event(
                      [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
                      { useNativeDriver: false, listener: handleDrag }
                    )}
                  >
                    <Animated.View
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: '#007aff',
                        alignSelf: 'center',
                        marginTop: 40,
                        transform: [
                          { translateX: pan.x },
                          { translateY: pan.y },
                          { scale: combinedScale },
                        ],
                      }}
                    />
                  </PanGestureHandler>
                </PinchGestureHandler>
              </TapGestureHandler>
            </TapGestureHandler>
          </LongPressGestureHandler>
        </View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
}

function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text>Завдання</Text>
    </View>
  );
}

function NextScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Наступний екран 🚀</Text>
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
          <Tab.Screen
            name="NextScreen"
            component={NextScreen}
            options={{
              tabBarButton: () => null, // приховуємо з таб-бару
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
