import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';

import {NotesContext} from '../contexts/notesContext';
import {useRealm, useQuery} from '@realm/react';
import {Notes} from '../realm/notesModel';

import NoteConfirmationModal from '../Modals/NoteConfirmationModal';

const NotesScreen = () => {
  const {
    // isNoteItemSelected,
    // setIsNoteItemSelected,
    anyNoteItemSelected,
    setAnyNoteItemSelected,
    setAllSelectedNotesFalse,
  } = useContext(NotesContext);
  // realm stuff
  const realm = useRealm();
  const NotesArray = useQuery(Notes);
  //
  const colorScheme = useColorScheme();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const currentTextinputBg = colorScheme == 'dark' ? '#222' : '#F8F8F8';
  const navigation = useNavigation();

  const noItemSelected = NotesArray.findIndex(obj => obj.isSelected == true); // check if no notes are aelected
  const allItemSelected = NotesArray.filter(obj => obj.isSelected == true); // get all selected notes

  // handle select all or select none
  function setAllSelectedTrue() {
    allItemSelected.length == NotesArray.length
      ? NotesArray.map(note => {
          realm.write(() => {
            note.isSelected = false;
          });
        })
      : NotesArray.map(note => {
          realm.write(() => {
            note.isSelected = true;
          });
        });
  }

  // component to render todo items
  const RenderNotes = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
          if (anyNoteItemSelected) {
            realm.write(() => {
              item.isSelected = !item.isSelected;
            });
          } else {
            navigation.navigate('editNote', {item});
          }
        }}
        onLongPress={() => {
          // setIsNoteItemSelected(true);
          setAnyNoteItemSelected(true);

          realm.write(() => {
            item.isSelected = !item.isSelected;
          });
        }}
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
        {anyNoteItemSelected && (
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
    noteBoxTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#333',
    },
    noteBoxBody: {
      fontSize: 20,
      fontWeight: '500',
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
                  allItemSelected.length == NotesArray.length
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
            <Pressable
              style={innerStyle.textinputContainer}
              onPress={() => navigation.navigate('searchNotes')}>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 20,
                  color: colorScheme == 'dark' ? '#fff' : '#888',
                  paddingHorizontal: 5,
                }}>
                Search notes
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
      </View>
      <FlatList
        contentContainerStyle={{paddingVertical: 5, gap: 15}}
        showsVerticalScrollIndicator={false}
        data={NotesArray.sorted('createdAt', true)}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({item, index}) => <RenderNotes {...{item, index}} />}
      />
    </SafeAreaView>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({});
