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
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AddTodoModal from '../Modals/AddTodoModal';
import DatePicker from 'react-native-date-picker';
import notifee, {EventType} from '@notifee/react-native';
import {BSON} from 'realm';
import {useRealm, useQuery} from '@realm/react';
import {Todos} from '../realm/todosModel';

import {TodosContext} from '../contexts/todosContext';
import TodoConfirmationModal from '../Modals/TodoConfirmationModal';
import {setAlertNotification} from '../components/notificationHandler';
import {useNavigation} from '@react-navigation/native';

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
    // isTodoItemSelected,
    setIsTodoItemSelected,
    anyTodoItemSelected,
    setAnyTodoItemSelected,
    setAllSelectedTodosFalse,
    // addBoxShown,
    setAddBoxShown,
  } = useContext(TodosContext);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  // realm stuff
  const realm = useRealm();

  const TodosArray = useQuery(Todos);
  //

  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';

  const [todoNote, setTodoNote] = useState('');
  const [filterBtn, setFilterBtn] = useState(0);
  const [editMode, setEditMode] = useState(false); // set to true if a todo is pressed
  const [focusItem, setFocusItem] = useState(null); // set to pressed todo

  const [alertProvided, setAlertProvided] = useState(false);

  const noItemSelected = TodosArray.findIndex(obj => obj.isSelected == true); // check if no todos are aelected
  const allItemSelected = TodosArray.filter(obj => obj.isSelected == true); // get all selected todos

  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedHour, setSelectedHour] = useState(0);

  const dateString = `${
    monthRep[selectedMonth]
  } ${selectedDate}, ${selectedYear} ${
    selectedHour < 10 ? '0' + selectedHour : selectedHour
  }:${selectedMinute < 10 ? '0' + selectedMinute : selectedMinute}`;

  useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      const item = TodosArray.find(obj => obj._id == detail.notification.id);
      if (item) {
        if (
          type === EventType.ACTION_PRESS &&
          detail.pressAction.id === 'mark-as-completed'
        ) {
          realm.write(() => {
            item.isCompleted = true;
          });
          await notifee.cancelNotification(detail.notification.id);
        }
      } else {
        await notifee.cancelNotification(detail.notification.id);
      }
    });
  }, []);

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
    setSelectedYear(0);
    setSelectedMonth(0);
    setSelectedDate(0);
    setSelectedHour(0);
    setSelectedMinute(0);
  }

  // function when a todo item is clicked
  function showFocusItem(item) {
    setFocusItem(item);
    setAlertProvided(item.isAlertProvided);
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
    allItemSelected.length == TodosArray.length
      ? TodosArray.map(todo => {
          realm.write(() => {
            todo.isSelected = false;
          });
        })
      : TodosArray.map(todo => {
          realm.write(() => {
            todo.isSelected = true;
          });
        });
  }

  // function to save or edit todo
  async function saveNewTodo() {
    // check if edit mode is true or false
    switch (editMode) {
      case true:
        const item = TodosArray.find(
          obj => obj._id.toHexString() == focusItem._id,
        );
        // if the todo item is still the same
        if (
          todoNote == item.body &&
          item.alertTime.year == selectedYear &&
          item.alertTime.month == selectedMonth &&
          item.alertTime.day == selectedDate &&
          item.alertTime.hour == selectedHour &&
          item.alertTime.minute == selectedMinute &&
          item.isAlertProvided == alertProvided
        ) {
          setAddBoxShown(false);
          setEditMode(false);
          setTodoNote('');
        } else {
          // update todo
          realm.write(() => {
            item.body = todoNote;
            item.isAlertProvided = alertProvided;
            item.alertTime = {
              month: selectedMonth,
              year: selectedYear,
              hour: selectedHour,
              minute: selectedMinute,
              day: selectedDate,
            };
          });
          setAddBoxShown(false);
          setEditMode(false);
          setToDefault();
          setTodoNote('');
          setAlertNotification(item);
        }
        break;
      case false:
        // create new todo
        realm.write(() => {
          realm.create(Todos, {
            _id: new BSON.ObjectId(),
            body: todoNote,
            isCompleted: false,
            isAlertProvided: alertProvided,
            alertTime: {
              month: selectedMonth,
              year: selectedYear,
              day: selectedDate,
              hour: selectedHour,
              minute: selectedMinute,
            },
            isSelected: false,
            createdAt: new Date(),
          });
        });
        setTodoNote('');
        setAddBoxShown(false);
        setToDefault();
        setAlertNotification(TodosArray.slice(TodosArray.length - 1)[0]);
        break;
    }
  }

  const RenderTodos = ({item, index}) => {
    // function to change the alert time color if the time has passed
    const checkDateMissed = () => {
      const date = new Date(Date.now());
      const currentDate = new Date(Date.now());
      // set the alert date with the provided alert date
      date.setFullYear(item.alertTime.year);
      date.setDate(item.alertTime.day);
      date.setHours(item.alertTime.hour);
      date.setMinutes(item.alertTime.minute);
      date.setMonth(item.alertTime.month);

      if (item.isCompleted && currentDate.getTime() > date.getTime()) {
        return currentTextColor;
      } else if (currentDate.getTime() > date.getTime()) {
        return 'red';
      }
    };

    return (
      <Pressable
        onPress={() => {
          if (anyTodoItemSelected) {
            realm.write(() => {
              item.isSelected = !item.isSelected;
            });
          } else {
            showFocusItem(item);
          }
        }}
        onLongPress={() => {
          // setIsTodoItemSelected(true);
          setAnyTodoItemSelected(true);

          realm.write(() => {
            item.isSelected = !item.isSelected;
          });
        }}
        style={innerStyle.todoBox}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
          }}>
          {!anyTodoItemSelected && (
            <Pressable
              onPress={() => {
                realm.write(() => {
                  item.isCompleted = !item.isCompleted;
                });
                setAlertNotification(item);
              }}>
              <Icon
                name={item.isCompleted ? 'circle-check' : 'circle'}
                solid={item.isCompleted ? true : false}
                color={themeColor}
                size={20}
              />
            </Pressable>
          )}
          <View style={{gap: 10, flex: 1}}>
            <Text
              numberOfLines={1}
              style={[
                innerStyle.todoBoxBody,
                {
                  textDecorationLine: item.isCompleted
                    ? 'line-through'
                    : 'none',
                },
              ]}>
              {item.body}
            </Text>
            {item.isAlertProvided && (
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                <Icon2
                  name="alarm-outline"
                  color={currentTextColor}
                  size={15}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: checkDateMissed(),
                    fontWeight: '500',
                  }}>
                  {`${monthRep[item.alertTime.month]} ${item.alertTime.day}, ${
                    item.alertTime.year
                  } ${
                    item.alertTime.hour < 10
                      ? '0' + item.alertTime.hour
                      : item.alertTime.hour
                  }:${
                    item.alertTime.minute < 10
                      ? '0' + item.alertTime.minute
                      : item.alertTime.minute
                  }`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {anyTodoItemSelected && (
          <Pressable
            onPress={() => {
              realm.write(() => {
                item.isSelected = !item.isSelected;
              });
            }}>
            <Icon
              name={item.isSelected ? 'square-check' : 'square'}
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
      fontSize: 22,
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
      gap: 5,
      width: '100%',
      height: 'auto',
      padding: 15,
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: currentTextinputBg,
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
                  allItemSelected.length == TodosArray.length
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
            <Pressable
              style={innerStyle.textinputContainer}
              onPress={() => navigation.navigate('searchTodos')}>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 20,
                  color: colorScheme == 'dark' ? '#fff' : '#888',
                  paddingHorizontal: 5,
                }}>
                Search to-dos
              </Text>
              <View style={{position: 'absolute', left: 5}}>
                <Icon2
                  name="search-outline"
                  color={colorScheme == 'dark' ? '#fff' : '#888'}
                  size={30}
                />
              </View>
            </Pressable>
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
        data={TodosArray.sorted('createdAt', true).filter(item => {
          switch (filterBtn) {
            case 0:
              return item;
            case 1:
              return item.isCompleted;
            case 2:
              return item.isCompleted == false;
          }
        })}
        keyExtractor={item => item._id.toHexString()}
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
