import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Modal from 'react-native-modal';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {NotesContext} from '../contexts/notesContext';
import {useDispatch} from 'react-redux';
import {deleteSelectedNote} from '../redux/features/notescCollection';

const NoteConfirmationModal = () => {
  const {showNoteModal, setShowNoteModal, setAllSelectedNotesFalse} =
    useContext(NotesContext);
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';

  return (
    <View>
      <Modal
        onBackButtonPress={() => {
          setShowNoteModal(false);
        }}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        backdropOpacity={0.1}
        animationInTiming={100}
        useNativeDriverForBackdrop
        animationOutTiming={100}
        avoidKeyboard={true}
        isVisible={showNoteModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: colorScheme == 'dark' ? '#222' : '#fff',
              height: 'auto',
              borderRadius: 10,
              paddingVertical: 15,

              gap: 10,

              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
            }}>
            <View style={{paddingHorizontal: 15, gap: 7, paddingBottom: 10}}>
              <Text
                style={{
                  color: currentTextColor,
                  fontSize: 22,
                  fontWeight: '500',
                }}>
                Delete the notes?
              </Text>
              <Text
                style={{
                  color: currentTextColor,
                  fontSize: 20,
                  fontWeight: '400',
                }}>
                Are you sure to delete the selected notes?
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#888',
                height: 0.7,
                width: '100%',
              }}></View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '70%',
                alignSelf: 'center',
              }}>
              <Pressable onPress={() => setShowNoteModal(false)}>
                <Text style={{color: '#888', fontSize: 20, fontWeight: '500'}}>
                  CANCEL
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  dispatch(deleteSelectedNote());
                  setShowNoteModal(false);
                  setAllSelectedNotesFalse();
                }}>
                <Text
                  style={{color: '#ff0000', fontSize: 20, fontWeight: '500'}}>
                  DELETE
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NoteConfirmationModal;

const styles = StyleSheet.create({});
