import {
  FlatList,
  Pressable,
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
import {useQuery, useRealm} from '@realm/react';

import {useNavigation} from '@react-navigation/native';
import {Todos} from '../realm/todosModel';
import {TodosContext} from '../contexts/todosContext';
import DatePicker from 'react-native-date-picker';
import AddTodoModal from '../Modals/AddTodoModal';
import {setAlertNotification} from '../components/notificationHandler';

// representation of the month index
const monthRep = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
};

const SearchTodos = () => {
  const {addBoxShown, setAddBoxShown} = useContext(TodosContext);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';
  const [searchText, setSearchText] = useState('');
  const realm = useRealm();
  const TodosArray = useQuery(Todos);
  const [array, setArray] = useState([]);

  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedHour, setSelectedHour] = useState(0);

  const [todoNote, setTodoNote] = useState('');
  const [editMode, setEditMode] = useState(false); // set to true if a todo is pressed
  const [focusItem, setFocusItem] = useState(null); // set to pressed todo
  const [alertProvided, setAlertProvided] = useState(false);

  const dateString = `${
    monthRep[selectedMonth]
  } ${selectedDate}, ${selectedYear} ${
    selectedHour < 10 ? '0' + selectedHour : selectedHour
  }:${selectedMinute < 10 ? '0' + selectedMinute : selectedMinute}`;

  useEffect(() => {
    searchText !== ''
      ? setArray(
          TodosArray.sorted('createdAt', true).filter(item =>
            item.body.toLowerCase().includes(searchText.toLowerCase()),
          ),
        )
      : setArray([]);
  }, [searchText]);

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
        // nothing to do here since new todo can't be added
        null;
        break;
    }
  }

  const innerStyle = StyleSheet.create({
    textinputContainer: {
      flex: 1,
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

  const RenderTodos = ({item, index}) => {
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
      <Pressable onPress={() => showFocusItem(item)} style={innerStyle.todoBox}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
          }}>
          <Pressable
            onPress={() => {
              realm.write(() => {
                item.isCompleted = !item.isCompleted;
              });
            }}>
            <Icon
              name={item.isCompleted ? 'circle-check' : 'circle'}
              solid={item.isCompleted ? true : false}
              color={themeColor}
              size={20}
            />
          </Pressable>

          <View style={{gap: 10}}>
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
      </Pressable>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: currentBgColor, padding: 15}}>
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
          setDate(new Date());
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          gap: 15,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="xmark" color={themeColor} size={30} />
        </Pressable>
        <View style={innerStyle.textinputContainer}>
          <TextInput
            style={innerStyle.textinput}
            placeholder="Search notes"
            defaultValue={searchText}
            onChangeText={newtext => setSearchText(newtext)}
            autoFocus
          />
          <View style={{position: 'absolute', left: 5}}>
            <Icon2 name="search-outline" color="#ccc" size={30} />
          </View>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingVertical: 5,
          gap: 15,
        }}
        showsVerticalScrollIndicator={false}
        data={array}
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

export default SearchTodos;

const styles = StyleSheet.create({});
