import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useQuery, useRealm} from '@realm/react';
import {Notes} from '../realm/notesModel';
import {useNavigation} from '@react-navigation/native';

const SearchNotes = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';
  const [searchText, setSearchText] = useState('');
  const NotesArray = useQuery(Notes);
  const [array, setArray] = useState([]);

  useEffect(() => {
    searchText !== ''
      ? setArray(
          NotesArray.sorted('createdAt', true).filter(
            item =>
              item.title.toLowerCase().includes(searchText.toLowerCase()) ||
              item.body.toLowerCase().includes(searchText.toLowerCase()) ||
              (item.title.toLowerCase().includes(searchText.toLowerCase()) &&
                item.body.toLowerCase().includes(searchText.toLowerCase())),
          ),
        )
      : setArray([]);
  }, [searchText]);

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
    noteBoxTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#333',
    },
    noteBoxBody: {
      fontSize: 20,
      fontWeight: '400',
      color: '#333',
    },
    noteBoxTime: {
      fontSize: 15,
      fontWeight: '400',
      color: '#333',
    },
    noteBox: {
      borderRadius: 10,
      width: '100%',
      height: 'auto',
      gap: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
    },
  });

  const RenderNotes = ({item, index}) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('editNote', {item})}
        style={[
          innerStyle.noteBox,
          {
            backgroundColor: currentTextinputBg,
          },
        ]}>
        <View style={{justifyContent: 'space-evenly', gap: 4, flex: 1}}>
          <Text numberOfLines={1} style={innerStyle.noteBoxTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={innerStyle.noteBoxBody}>
            {item.body}
          </Text>
          <Text numberOfLines={1} style={innerStyle.noteBoxTime}>
            {item.time}
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: currentBgColor, padding: 15}}>
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
        contentContainerStyle={{paddingVertical: 5, gap: 15}}
        showsVerticalScrollIndicator={false}
        data={array}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({item, index}) => <RenderNotes {...{item, index}} />}
      />
    </SafeAreaView>
  );
};

export default SearchNotes;

const styles = StyleSheet.create({});
