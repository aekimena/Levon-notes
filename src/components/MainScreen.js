import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomTabs from './BottomTabs';
import NotesScreen from '../screens/NotesScreen';
import TodosScreen from '../screens/TodosScreen';

const MainScreen = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator tabBar={props => <BottomTabs {...props} />}>
      <Tab.Screen
        name="notes"
        component={NotesScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="todos"
        component={TodosScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
