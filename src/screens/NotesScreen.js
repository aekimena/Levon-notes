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
import React, {useContext, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {NotesContext} from '../contexts/notesContext';
import {
  selectAllFalse,
  selectAllTrue,
  selectToDelete,
} from '../redux/features/notescCollection';
import NoteConfirmationModal from '../Modals/NoteConfirmationModal';

const NotesScreen = () => {
  const {
    isNoteItemSelected,
    setIsNoteItemSelected,
    anyNoteItemSelected,
    setAnyNoteItemSelected,
    setAllSelectedNotesFalse,
  } = useContext(NotesContext);
  const colorScheme = useColorScheme();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';
  const navigation = useNavigation();
  const notes = useSelector(state => state.notesCollection.notesArray);
  const dispatch = useDispatch();

  const noItemSelected = notes.findIndex(obj => obj.selected == true); // check if no notes are aelected
  const allItemSelected = notes.filter(todo => todo.selected == true); // get all selected notes

  // handle select all or select none
  function setAllSelectedTrue() {
    allItemSelected.length == notes.length
      ? notes.map(note => {
          dispatch(selectAllFalse(note));
        })
      : notes.map(note => {
          dispatch(selectAllTrue(note));
        });
  }

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
        onPress={() => {
          anyNoteItemSelected ? null : navigation.navigate('editNote', {item});
        }}
        onLongPress={() => {
          setIsNoteItemSelected(true);
          setAnyNoteItemSelected(true);
          dispatch(selectToDelete(item));
        }}
        style={[
          innerStyle.noteBox,
          {
            backgroundColor: checkIndex(),
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
        {anyNoteItemSelected && (
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
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: currentBgColor, padding: 15}}>
      <StatusBar
        barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentBgColor}
      />
      <NoteConfirmationModal />

      <View style={{gap: 20, paddingVertical: 10}}>
        {anyNoteItemSelected ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Pressable onPress={setAllSelectedNotesFalse}>
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
                  allItemSelected.length == notes.length
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
            <Text style={innerStyle.headerText}>Notes</Text>
            <View style={innerStyle.textinputContainer}>
              <TextInput
                style={innerStyle.textinput}
                placeholder="Search notes"
              />
              <View style={{position: 'absolute', left: 5}}>
                <Icon2 name="search-outline" color="#ccc" size={30} />
              </View>
            </View>
          </>
        )}
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
