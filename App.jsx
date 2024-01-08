import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './src/components/MainScreen';
import NewNote from './src/screens/NewNote';
import EditNote from './src/screens/EditNote';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import TodosContextProvider from './src/contexts/todosContext';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <TodosContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="main"
              component={MainScreen}
              options={{headerShown: false, presentation: 'card'}}
            />
            <Stack.Screen
              name="newNote"
              component={NewNote}
              options={{headerShown: false, presentation: 'card'}}
            />
            <Stack.Screen
              name="editNote"
              component={EditNote}
              options={{headerShown: false, presentation: 'card'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TodosContextProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
