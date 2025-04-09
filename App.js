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
  Button,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function GameScreen() {
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState({
    clicks10: 0,
    doubleClicks5: 0,
    longPress: false,
    drag: false,
    swipeRight: false,
    swipeLeft: false,
    pinch: false,
    score100: false,
  });
  
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

  const updateScore = (points, updateTaskCallback) => {
    const newScore = score + points;
    const updatedTasks = { ...tasks };

    if (newScore >= 100) updatedTasks.score100 = true;
    if (updateTaskCallback) updateTaskCallback(updatedTasks);

    setScore(newScore);
    setTasks(updatedTasks);
    animatePulse();
    Vibration.vibrate(50);
  };

  const handleTap = () => {
    updateScore(1, (updatedTasks) => {
      if (updatedTasks.clicks10 < 10) updatedTasks.clicks10 += 1;
    });
  };

  const handleDoubleTap = () => {
    updateScore(2, (updatedTasks) => {
      if (updatedTasks.doubleClicks5 < 5) updatedTasks.doubleClicks5 += 1;
    });
  };

  const handleLongPress = () => {
    updateScore(5, (updatedTasks) => {
      updatedTasks.longPress = true;
    });
  };

  const handleDrag = () => {
    updateScore(3, (updatedTasks) => {
      updatedTasks.drag = true;
    });
  };

  const handleFling = (direction) => {
    updateScore(Math.floor(Math.random() * 10) + 1, (updatedTasks) => {
      if (direction === 'right') {
        updatedTasks.swipeRight = true;
        navigation.goBack();
      } else if (direction === 'left') {
        updatedTasks.swipeLeft = true;
        navigation.navigate('NextScreen');
      }
    });
  };

  const handlePinch = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    {
      useNativeDriver: true,
      listener: () => {
        updateScore(7, (updatedTasks) => {
          updatedTasks.pinch = true;
        });
      },
    }
  );

  const combinedScale = Animated.multiply(pinchScale, pulse);

  const handleReset = () => {
    Alert.alert(
      'Скинути прогрес',
      'Ти впевнена, що хочеш скинути всі результати?',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Так',
          onPress: () => {
            setScore(0);
            setTasks({
              clicks10: 0,
              doubleClicks5: 0,
              longPress: false,
              drag: false,
              swipeRight: false,
              swipeLeft: false,
              pinch: false,
              score100: false,
            });
          },
        },
      ]
    );
  };

  return (
    <FlingGestureHandler
      direction={Directions.RIGHT}
      onActivated={() => handleFling('right')}>
      <FlingGestureHandler
        direction={Directions.LEFT}
        onActivated={() => handleFling('left')}>
        <View style={styles.container}>
          <Text style={{ fontSize: 28, textAlign: 'center' }}>Очки: {score}</Text>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>Завдань виконано: {
            Object.values(tasks).filter(val => val === true || typeof val === 'number' && val > 0).length
          } / 8</Text>

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

          <Button title="Скинути прогрес" onPress={handleReset} />
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
              tabBarButton: () => null, 
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
