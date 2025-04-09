import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, Vibration, Alert, Button } from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  Directions,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';  // Додано useNavigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from 'react-native-vector-icons';

const tasksList = [
  { id: '1', title: 'Зробити 10 кліків', key: 'clicks10' },
  { id: '2', title: '5 подвійних кліків', key: 'doubleClicks5' },
  { id: '3', title: 'Утримати 3 секунди', key: 'longPress' },
  { id: '4', title: 'Перетягнути обʼєкт', key: 'drag' },
  { id: '5', title: 'Свайп вправо', key: 'swipeRight' },
  { id: '6', title: 'Свайп вліво', key: 'swipeLeft' },
  { id: '7', title: 'Змінити розмір', key: 'pinch' },
  { id: '8', title: 'Отримати 100 очок', key: 'score100' },
];

function GameScreen() {
  const navigation = useNavigation();  
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

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const updateScore = (points) => {
    const newScore = score + points;
    const newTasks = { ...tasks };
    if (newScore >= 100) newTasks.score100 = true;
    setScore(newScore);
    setTasks(newTasks);
  };

  const handleTap = () => {
    const newTasks = { ...tasks };
    newTasks.clicks10 += 1;
    if (newTasks.clicks10 >= 10) newTasks.clicks10 = 10;
    setTasks(newTasks);
    animatePulse();
    updateScore(1);
    Vibration.vibrate(30);
  };

  const handleDoubleTap = () => {
    const newTasks = { ...tasks };
    newTasks.doubleClicks5 += 1;
    if (newTasks.doubleClicks5 >= 5) newTasks.doubleClicks5 = 5;
    setTasks(newTasks);
    animatePulse();
    updateScore(2);
    Vibration.vibrate(50);
  };

  const handleLongPress = () => {
    if (!tasks.longPress) {
      const newTasks = { ...tasks, longPress: true };
      setTasks(newTasks);
      updateScore(5);
      animatePulse();
      Vibration.vibrate(200);
    }
  };

  const handleDrag = () => {
    if (!tasks.drag) {
      const newTasks = { ...tasks, drag: true };
      setTasks(newTasks);
      updateScore(3);
      animatePulse();
    }
  };

  const handleFling = (direction) => {
    if (direction === 'right') {
      navigation.goBack();  // Повернення до попереднього екрану
    } else if (direction === 'left') {
      navigation.navigate('NextScreen');  // Переходить на наступний екран
    }

    const newTasks = { ...tasks };
    if (direction === 'right') newTasks.swipeRight = true;
    if (direction === 'left') newTasks.swipeLeft = true;
    setTasks(newTasks);
    updateScore(Math.floor(Math.random() * 10) + 1);
    animatePulse();
  };

  const handlePinch = (event) => {
    if (!tasks.pinch) {
      setTasks({ ...tasks, pinch: true });
      updateScore(7);
    }
    scale.setValue(event.nativeEvent.scale);
  };

  const animatePulse = () => {
    pulse.setValue(1);
    Animated.sequence([ 
      Animated.timing(pulse, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.score}>Очки: {score}</Text>
      <Button title="Скинути прогрес" onPress={handleReset} />
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onActivated={() => handleFling('right')}>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onActivated={() => handleFling('left')}>
          <PinchGestureHandler onGestureEvent={handlePinch}>
            <PanGestureHandler
              onGestureEvent={Animated.event(
                [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
                { useNativeDriver: false, listener: handleDrag }
              )}>
              <LongPressGestureHandler
                onActivated={handleLongPress}
                minDurationMs={3000}>
                <TapGestureHandler
                  onActivated={handleDoubleTap}
                  numberOfTaps={2}>
                  <TapGestureHandler onActivated={handleTap}>
                    <Animated.View
                      style={[styles.circle, {
                        transform: [
                          { translateX: pan.x },
                          { translateY: pan.y },
                          { scale: Animated.multiply(scale, pulse) },
                        ],
                      }]}
                    />
                  </TapGestureHandler>
                </TapGestureHandler>
              </LongPressGestureHandler>
            </PanGestureHandler>
          </PinchGestureHandler>
        </FlingGestureHandler>
      </FlingGestureHandler>
    </GestureHandlerRootView>
  );
}

function TasksScreen() {
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    setCompletedTasks({
      clicks10: true,
      doubleClicks5: true,
      longPress: true,
      drag: true,
      swipeRight: true,
      swipeLeft: true,
      pinch: true,
      score100: true,
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={{ flex: 1 }}>{item.title}</Text>
      {completedTasks[item.key] && <MaterialIcons name="check-circle" size={24} color="green" />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasksList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function HomeScreen() {
  useEffect(() => {
    Alert.alert('Ласкаво просимо!', 'Це гра-клікер з жестами. Натискай, утримуй, свайпай і масштабуй коло, щоб заробити очки і виконати завдання!');
  }, []);

  return <GameScreen />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Гра" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => (<MaterialIcons name="sports-esports" size={size} color={color} />) }} />
        <Tab.Screen name="Завдання" component={TasksScreen} options={{ tabBarIcon: ({ color, size }) => (<MaterialIcons name="list" size={size} color={color} />) }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f7',
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007aff',
    alignSelf: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});