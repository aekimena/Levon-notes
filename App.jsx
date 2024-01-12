import {StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './src/components/MainScreen';
import NewNote from './src/screens/NewNote';
import EditNote from './src/screens/EditNote';
import TodosContextProvider from './src/contexts/todosContext';
import NotesContextProvider from './src/contexts/notesContext';
import {RealmProvider} from '@realm/react';
import {Todos} from './src/realm/todosModel';
import {Notes} from './src/realm/notesModel';
import SearchNotes from './src/screens/SearchNotes';
import SearchTodos from './src/screens/SearchTodos';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <RealmProvider schema={[Todos, Notes]} schemaVersion={1}>
      <NotesContextProvider>
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
              <Stack.Screen
                name="searchNotes"
                component={SearchNotes}
                options={{headerShown: false, presentation: 'card'}}
              />
              <Stack.Screen
                name="searchTodos"
                component={SearchTodos}
                options={{headerShown: false, presentation: 'card'}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </TodosContextProvider>
      </NotesContextProvider>
    </RealmProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
