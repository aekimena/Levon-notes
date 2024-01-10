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
import AddTodoModal from '../Modals/AddTodoModal';
import DatePicker from 'react-native-date-picker';

import {
  addTodo,
  completeTodo,
  editTodo,
  selectAllFalse,
  selectAllTrue,
  selectToDelete,
} from '../redux/features/todosCollection';
import {TodosContext} from '../contexts/todosContext';
import TodoConfirmationModal from '../Modals/TodoConfirmationModal';

// representation of the month index
const monthRep = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
};

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

  const noItemSelected = todos.findIndex(obj => obj.selected == true); // check if no todos are aelected
  const allItemSelected = todos.filter(todo => todo.selected == true); // get all selected todos

  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const dateString = `${
    monthRep[selectedMonth]
  } ${selectedDate}, ${selectedYear} ${
    selectedHour < 10 ? '0' + selectedHour : selectedHour
  }:${selectedMinute < 10 ? '0' + selectedMinute : selectedMinute}`;

  const [newTodoId, setNewTodoId] = useState(todos.length);

  // get date from the selected date
  function extractDate(date) {
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
    setSelectedDate(date.getDate());
    setSelectedHour(date.getHours());
    setSelectedMinute(date.getMinutes());
  }

  // set all date state back to default
  function setToDefault() {
    setAlertProvided(false);
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedMinute(null);
  }

  // function when a todo item is clicked
  function showFocusItem(item) {
    console.log(item.id);
    setFocusItem(item);
    setAlertProvided(item.alertProvided);
    setSelectedYear(item.alertTime.year);
    setSelectedMonth(item.alertTime.month);
    setSelectedDate(item.alertTime.day);
    setSelectedHour(item.alertTime.hour);
    setSelectedMinute(item.alertTime.minute);

    setEditMode(true);
    setTodoNote(item.body);
    setAddBoxShown(true);
  }

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
        // if the todo item is still the same
        if (
          todoNote === todos[index].body &&
          todos[index].alertTime.year == selectedYear &&
          todos[index].alertTime.month == selectedMonth &&
          todos[index].alertTime.day == selectedDate &&
          todos[index].alertTime.hour == selectedHour &&
          todos[index].alertTime.minute == selectedMinute &&
          todos[index].alertProvided == alertProvided
        ) {
          setAddBoxShown(false);
          setEditMode(false);
          setTodoNote('');
        } else {
          // update the todo item
          dispatch(
            editTodo({
              ...focusItem,
              body: todoNote,
              alertProvided: alertProvided,
              alertTime: {
                month: selectedMonth,
                year: selectedYear,
                hour: selectedHour,
                minute: selectedMinute,
                day: selectedDate,
              },
            }),
          );
          setAddBoxShown(false);
          setEditMode(false);
          setToDefault();
          setTodoNote('');
        }
        break;
      case false:
        // create new todo
        dispatch(
          addTodo({
            id: `id_${Date.now()}`,
            body: todoNote,
            completed: false,
            alertProvided: alertProvided,
            alertTime: {
              month: selectedMonth,
              day: selectedDate,
              minute: selectedMinute,
              hour: selectedHour,
              year: selectedYear,
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

    // function to stike the alert time if the todo is completed
    function checkDateCompletion() {
      if (item.completed) {
        return 'line-through';
      } else {
        return 'none';
      }
    }

    // function to change the alert time color if the time has passed
    function checkDateMissed() {
      const date = new Date(Date.now());
      const currentDate = new Date(Date.now());
      // set the alert date with the provided alert date
      date.setFullYear(item.alertTime.year);
      date.setDate(item.alertTime.day);
      date.setHours(item.alertTime.hour);
      date.setMinutes(item.alertTime.minute);
      date.setMonth(item.alertTime.month);

      if (item.completed && currentDate.getTime() > date.getTime()) {
        return currentTextColor;
      } else if (currentDate.getTime() > date.getTime()) {
        return 'red';
      }
    }

    return (
      <Pressable
        onPress={() => {
          if (anyTodoItemSelected) {
            null;
          } else {
            showFocusItem(item);
          }
        }}
        onLongPress={() => {
          setIsTodoItemSelected(true);
          setAnyTodoItemSelected(true);
          dispatch(selectToDelete(item));
        }}
        style={{
          borderRadius: 10,
          gap: 5,
          width: '100%',
          height: 'auto',
          padding: 15,
          paddingVertical: 20,
          backgroundColor: checkIndex(), // a background color is returned
        }}>
        <View style={[innerStyle.todoBox, {}]}>
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
        </View>
        {item.alertProvided && (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
            <Icon2 name="alarm-outline" color={currentTextColor} size={15} />
            <Text
              style={{
                fontSize: 15,
                // color: currentTextColor,
                textDecorationLine: checkDateCompletion(),
                color: checkDateMissed(),
                fontWeight: '500',
              }}>
              {`${monthRep[item.alertTime.month]} ${item.alertTime.day}, ${
                item.alertTime.year
              } ${item.alertTime.hour}:${item.alertTime.minute}`}
            </Text>
          </View>
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
      gap: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: currentBgColor, paddingTop: 15}}>
      <StatusBar
        barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentBgColor}
      />
      <TodoConfirmationModal />

      <DatePicker
        modal
        textColor={themeColor}
        minimumDate={date}
        open={openDatePicker}
        date={date}
        onConfirm={date => {
          setDate(date);
          extractDate(date);
          setAlertProvided(true);
          setOpenDatePicker(false);
          setDate(new Date());
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
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
                fontSize: 18,
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
                fontSize: 18,
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
                fontSize: 18,
              }}>
              Undone
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
        alertProvided={alertProvided}
        dateString={dateString}
        setOpenDatePicker={setOpenDatePicker}
        setToDefault={setToDefault}
      />
    </SafeAreaView>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({});
