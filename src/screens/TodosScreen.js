import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useDispatch, useSelector} from 'react-redux';
import AddTodoModal from '../components/AddTodoModal';
import {
  addTodo,
  completeTodo,
  editTodo,
  selectAllFalse,
  selectAllTrue,
  selectToDelete,
} from '../redux/features/todosCollection';
import {TodosContext} from '../contexts/todosContext';

const TodosScreen = () => {
  const {
    isTodoItemSelected,
    setIsTodoItemSelected,
    anyTodoItemSelected,
    setAnyTodoItemSelected,
    setAllSelectedTodosFalse,
    addBoxShown,
    setAddBoxShown,
  } = useContext(TodosContext);
  const colorScheme = useColorScheme();
  const todos = useSelector(state => state.todosCollection.todosArray);
  const dispatch = useDispatch();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';

  const [todoNote, setTodoNote] = useState('');
  const [filterBtn, setFilterBtn] = useState(0);
  const [editMode, setEditMode] = useState(false); // set to true if a todo is pressed
  const [focusItem, setFocusItem] = useState(null); // set to pressed todo

  // these states are for setting alert if provided
  const [alertProvided, setAlertProvided] = useState(false);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [minute, setMinute] = useState(null);
  const [hour, setHour] = useState(null);
  const [year, setYear] = useState(null);

  const noItemSelected = todos.findIndex(obj => obj.selected == true); // check if no todos are aelected
  const allItemSelected = todos.filter(todo => todo.selected == true); // get all selected todos

  // handle select all or select none
  function setAllSelectedTrue() {
    allItemSelected.length == todos.length
      ? todos.map(todo => {
          dispatch(selectAllFalse(todo));
        })
      : todos.map(todo => {
          dispatch(selectAllTrue(todo));
        });
  }

  // function to save or edit todo
  function saveNewTodo() {
    // check if edit mode is true or false
    switch (editMode) {
      case true:
        const index = todos.findIndex(obj => obj.id === focusItem.id);
        if (todoNote === todos[index].body) {
          setAddBoxShown(false);
          setEditMode(false);
          setTodoNote('');
        } else {
          dispatch(editTodo({...focusItem, body: todoNote}));
          setAddBoxShown(false);
          setEditMode(false);
          setTodoNote('');
        }
        break;
      case false:
        dispatch(
          addTodo({
            id: `id_${Date.now()}`,
            body: todoNote,
            completed: false,
            alertProvided: alertProvided,
            alertTime: {
              month: month,
              day: day,
              minute: minute,
              hour: hour,
              year: year,
            },
          }),
        );
        setTodoNote('');
        setAlertProvided(false);
        setAddBoxShown(false);
        break;
    }
  }

  const RenderTodos = ({item, index}) => {
    let startIndex = 0;
    // function to assign background colors to every first five todos when looped
    function checkIndex() {
      while (startIndex < todos.length + 5) {
        const newArray = todos.slice(startIndex, startIndex + 5);
        switch (newArray.indexOf(item)) {
          case 0:
            return '#FFE2D9';
          case 1:
            return '#D9E0FF';
          case 2:
            return '#EEEEEE';
          case 3:
            return '#C4FFE4';
          case 4:
            return '#EBFFC4';
        }
        startIndex += 5;
      }
    }

    return (
      <Pressable
        onPress={() => {
          setFocusItem(item);
          setEditMode(true);
          setTodoNote(item.body);
          setAddBoxShown(true);
        }}
        onLongPress={() => {
          setIsTodoItemSelected(true);
          setAnyTodoItemSelected(true);
          dispatch(selectToDelete(item));
        }}
        style={[
          innerStyle.todoBox,
          {
            backgroundColor: checkIndex(), // a background color is returned
          },
        ]}>
        <View
          style={{
            justifyContent: 'flex-start',
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          {!anyTodoItemSelected && (
            <Pressable onPress={() => dispatch(completeTodo({id: item.id}))}>
              <Icon
                name={item.completed ? 'circle-check' : 'circle'}
                solid={item.completed ? true : false}
                color={themeColor}
                size={20}
              />
            </Pressable>
          )}

          <Text
            numberOfLines={1}
            style={[
              innerStyle.todoBoxBody,
              {textDecorationLine: item.completed ? 'line-through' : 'none'},
            ]}>
            {item.body}
          </Text>
        </View>
        {anyTodoItemSelected && (
          <Pressable onPress={() => dispatch(selectToDelete(item))}>
            <Icon
              name={item.selected ? 'square-check' : 'square'}
              size={25}
              color={themeColor}
            />
          </Pressable>
        )}
      </Pressable>
    );
  };

  const innerStyle = StyleSheet.create({
    headerText: {fontSize: 30, color: currentTextColor, fontWeight: '500'},
    textinputContainer: {
      width: '100%',
      height: 50,
      backgroundColor: currentTextinputBg,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 35,
    },
    textinput: {
      height: '100%',
      width: '100%',
      color: currentTextColor,
      fontSize: 20,
    },

    todoBoxBody: {
      fontSize: 20,
      fontWeight: '500',
      color: '#333',
      flex: 1,
    },
    todoBoxTime: {
      fontSize: 17,
      fontWeight: '400',
      color: '#333',
    },
    filterbtns: {
      paddingVertical: 8,
      paddingHorizontal: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    todoBox: {
      borderRadius: 10,
      width: '100%',
      height: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      paddingVertical: 20,
    },
  });
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: currentBgColor, paddingTop: 15}}>
      <StatusBar
        barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentBgColor}
      />

      <View style={{gap: 20, paddingVertical: 10, paddingHorizontal: 15}}>
        {anyTodoItemSelected ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Pressable onPress={setAllSelectedTodosFalse}>
                <Icon name="xmark" size={25} color={themeColor} />
              </Pressable>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color: currentTextColor,
                }}>
                {noItemSelected == -1
                  ? 'Please select items'
                  : `${allItemSelected.length} Item selected`}
              </Text>
            </View>
            <Pressable onPress={setAllSelectedTrue}>
              <Icon
                name={
                  allItemSelected.length == todos.length
                    ? 'square-check'
                    : 'square'
                }
                size={25}
                color={themeColor}
              />
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={innerStyle.headerText}>To-dos</Text>
            <View style={innerStyle.textinputContainer}>
              <TextInput
                style={innerStyle.textinput}
                placeholder="Search to-dos"
              />
              <View style={{position: 'absolute', left: 5}}>
                <Icon2 name="search-outline" color="#ccc" size={30} />
              </View>
            </View>
          </>
        )}

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Pressable
            onPress={() => setFilterBtn(0)}
            style={[
              innerStyle.filterbtns,
              {
                backgroundColor:
                  filterBtn == 0 ? themeColor : currentTextinputBg,
              },
            ]}>
            <Text
              style={{
                color: filterBtn == 0 ? '#fff' : currentTextColor,
                fontWeight: '400',
                fontSize: 20,
              }}>
              All
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilterBtn(1)}
            style={[
              innerStyle.filterbtns,
              {
                backgroundColor:
                  filterBtn == 1 ? themeColor : currentTextinputBg,
              },
            ]}>
            <Text
              style={{
                color: filterBtn == 1 ? '#fff' : currentTextColor,
                fontWeight: '400',
                fontSize: 20,
              }}>
              Completed
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilterBtn(2)}
            style={[
              innerStyle.filterbtns,
              {
                backgroundColor:
                  filterBtn == 2 ? themeColor : currentTextinputBg,
              },
            ]}>
            <Text
              style={{
                color: filterBtn == 2 ? '#fff' : currentTextColor,
                fontWeight: '400',
                fontSize: 20,
              }}>
              Uncompleted
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{
          paddingVertical: 5,
          gap: 15,
          paddingHorizontal: 15,
        }}
        showsVerticalScrollIndicator={false}
        // view the todos based on the selected filter button
        data={todos.filter(item => {
          switch (filterBtn) {
            case 0:
              return item;
            case 1:
              return item.completed;
            case 2:
              return item.completed == false;
          }
        })}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => <RenderTodos {...{item, index}} />}
      />

      {/* modal to add or edit todo */}
      <AddTodoModal
        todoNote={todoNote}
        setTodoNote={setTodoNote}
        saveNewTodo={saveNewTodo}
        editMode={editMode}
        setEditMode={setEditMode}
      />
    </SafeAreaView>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({});
