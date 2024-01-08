import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {addNote} from '../redux/features/notescCollection';

const month = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
};

const day = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
};

const NewNote = () => {
  const colorScheme = useColorScheme();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const dispatch = useDispatch();
  const date = new Date(Date.now());

  const innerStyle = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderColor: currentTextColor,
      padding: 15,
    },
    titleInput: {
      height: 'auto',
      width: '100%',
      color: currentTextColor,
      fontSize: 25,
      fontWeight: '500',
    },
    bodyInput: {
      height: '100%',
      width: '100%',
      color: currentTextColor,
      fontSize: 20,
      fontWeight: '400',
    },
  });

  function goBack() {
    navigation.goBack();
  }

  function saveNewNote() {
    dispatch(
      addNote({
        id: `id_${Date.now()}`,
        title: title,
        body: body,
        time: `${date.getHours()}:${date.getMinutes()}, ${
          month[date.getMonth()]
        } ${day[date.getDay()]}, ${date.getFullYear()}`,
      }),
    );
    navigation.goBack();
  }
  return (
    <SafeAreaView style={{backgroundColor: currentBgColor, flex: 1}}>
      <View style={innerStyle.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Pressable onPress={goBack}>
            <Icon name="arrow-left" color={themeColor} size={25} />
          </Pressable>
          <Text
            style={{color: currentTextColor, fontSize: 22, fontWeight: '500'}}>
            New Note
          </Text>
        </View>
        {(title !== '' || body !== '') && (
          <Pressable onPress={saveNewNote}>
            <Icon name="check" size={25} color={themeColor} />
          </Pressable>
        )}
      </View>
      <View
        style={{
          width: '100%',
          height: 'auto',
          // backgroundColor: 'red',
          marginTop: 5,

          // paddingVertical: 20,
          paddingHorizontal: 15,
        }}>
        <TextInput
          style={innerStyle.titleInput}
          placeholder="Title"
          placeholderTextColor={'#888'}
          multiline
          autoFocus
          defaultValue={title}
          onChangeText={newText => setTitle(newText)}
        />
      </View>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 15,
          // height: 'auto',
          // backgroundColor: 'green',
          flex: 1,
        }}>
        <TextInput
          style={innerStyle.bodyInput}
          placeholder="Note something down"
          placeholderTextColor={'#888'}
          textAlignVertical="top"
          multiline
          defaultValue={body}
          onChangeText={newText => setBody(newText)}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewNote;

const styles = StyleSheet.create({});
