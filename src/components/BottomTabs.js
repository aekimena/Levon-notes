import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Keyboard,
  Text,
  Pressable,
} from 'react-native';

import React, {useState, useEffect, useContext} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {Shadow} from 'react-native-shadow-2';
import {useNavigation} from '@react-navigation/native';
import {TodosContext} from '../contexts/todosContext';
import {NotesContext} from '../contexts/notesContext';

const themeColor = '#60B1D6';
// these are the tab icons
const tabIcons = {
  notes: 'note-sticky',
  todos: 'circle-check',
};
const BottomTabs = ({state, descriptors, navigation}) => {
  const {setAddBoxShown, setShowTodoModal, anyTodoItemSelected} =
    useContext(TodosContext);

  const {setShowNoteModal, anyNoteItemSelected} = useContext(NotesContext);
  const window = useWindowDimensions();
  const [currentRoute, setCurrentRoute] = useState('notes'); // check the current route
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const navigation2 = useNavigation();

  // useffect to hide bottom tab when the keyboard is active

  useEffect(() => {
    const showTab = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideTab = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showTab.remove();
      hideTab.remove();
    };
  }, []);

  // function to either add new todo or note, depending on the current route
  function newNoteOrTodo() {
    currentRoute == 'notes'
      ? navigation2.navigate('newNote')
      : setAddBoxShown(true);
  }

  // function to either add new todo/note or delete todo/note
  function handlePress() {
    if (anyNoteItemSelected || anyTodoItemSelected) {
      if (anyTodoItemSelected && currentRoute !== 'notes') {
        setShowTodoModal(true);
      } else if (anyNoteItemSelected && currentRoute === 'notes') {
        setShowNoteModal(true);
      }
    } else {
      newNoteOrTodo();
    }
  }

  // return an particular icon if notes or todo screen has an active selected state
  function handleIconDisplay() {
    if (
      (currentRoute !== 'notes' && anyTodoItemSelected) ||
      (currentRoute == 'notes' && anyNoteItemSelected)
    ) {
      return 'trash-bin-outline';
    } else {
      return 'add-outline';
    }
  }

  return (
    <Shadow offset={[0, 5]} startColor="rgba(0,0,0,0.15)">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          bottom: 0,
          justifyContent: 'center',
          width: window.width,
          display: keyboardStatus ? 'none' : 'flex',
        }}>
        <Pressable
          onPress={handlePress}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: themeColor,
            position: 'absolute',
            bottom: 40,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
          }}>
          <Icon2 name={handleIconDisplay()} size={40} color="#fff" />
        </Pressable>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
              //   console.log(route.name);
              setCurrentRoute(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              key={index}
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
                gap: 5,
              }}>
              <Icon
                name={tabIcons[label]}
                solid={isFocused ? true : false}
                size={22}
                color="#222"
              />
              <Text style={{color: '#222', fontSize: 15, fontWeight: '400'}}>
                {tabIcons[label] == 'note-sticky' ? 'Notes' : 'To-dos'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Shadow>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
