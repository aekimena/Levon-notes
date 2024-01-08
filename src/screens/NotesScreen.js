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
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const NotesScreen = () => {
  const colorScheme = useColorScheme();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';
  const navigation = useNavigation();
  const notes = useSelector(state => state.notesCollection.notesArray);

  const data = [
    {
      id: 1,
      title: 'Title for expo',
      body: 'This is the body text fr about 2 times in a row',
      time: '17, jan, 2000',
    },
    {id: 2, title: 'Title', body: 'This is the body text', time: '2:00'},
    {id: 3, title: 'Title', body: 'This is the body text', time: '2:00'},
    {id: 4, title: 'Title', body: 'This is the body text', time: '2:00'},
    {id: 5, title: 'Title', body: 'This is the body text', time: '2:00'},
  ];

  const RenderNotes = ({item, index}) => {
    let startIndex = 0;
    function checkIndex() {
      while (startIndex < notes.length + 5) {
        const newArray = notes.slice(startIndex, startIndex + 5);
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
        onPress={() => navigation.navigate('editNote', {item})}
        style={{
          backgroundColor: checkIndex(),
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          padding: 15,
        }}>
        <View style={{justifyContent: 'space-evenly', gap: 4}}>
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
  });
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: currentBgColor, padding: 15}}>
      <StatusBar
        barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentBgColor}
      />

      <View style={{gap: 20, paddingVertical: 10}}>
        <Text style={innerStyle.headerText}>Notes</Text>
        <View style={innerStyle.textinputContainer}>
          <TextInput style={innerStyle.textinput} placeholder="Search notes" />
          <View style={{position: 'absolute', left: 5}}>
            <Icon2 name="search-outline" color="#ccc" size={30} />
          </View>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{paddingVertical: 5, gap: 15}}
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => <RenderNotes {...{item, index}} />}
      />
    </SafeAreaView>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({});
