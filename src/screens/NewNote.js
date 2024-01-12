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
import {BSON} from 'realm';
import {useRealm, useQuery} from '@realm/react';
import {Notes} from '../realm/notesModel';

const month = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
};

const NewNote = () => {
  // realm stuff
  const realm = useRealm();
  //
  const colorScheme = useColorScheme();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
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
    realm.write(() => {
      realm.create(Notes, {
        _id: new BSON.ObjectID(),
        title: title,
        body: body,
        time: `${
          date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        }:${
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        }, ${
          month[date.getMonth() + 1]
        } ${date.getDate()}, ${date.getFullYear()}`,
        createdAt: new Date(),
      });
    });
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

          marginTop: 5,

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
