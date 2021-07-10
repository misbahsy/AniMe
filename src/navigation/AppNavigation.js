/* eslint-disable react-native/no-inline-styles */
/* eslint-disable comma-dangle */
import React from 'react';
import {StyleSheet,} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from "../screens/HomeScreen";
import ResultScreen from "../screens/ResultScreen";
import SearchScreen from "../screens/SearchScreen";

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
  },
  headerStyle: {
    backgroundColor: '#FF6F00',
    elevation: 0,
    shadowColor: 'transparent',
    borderBottomWidth: 0,
  },
  headerBackStyle: {
    color: 'white',
  },
});

const Stack = createStackNavigator();

//ios
const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home">
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Result"
        component={ResultScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Search"
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
};

//android

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Navigator/>
    </NavigationContainer>
  );
};

export default AppContainer;
