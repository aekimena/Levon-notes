import {Pressable, StyleSheet, Text, View, useColorScheme} from 'react-native';
import React, {useContext, useState} from 'react';
import Modal from 'react-native-modal';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import {useQuery, useRealm} from '@realm/react';
import {Notes} from '../realm/notesModel';

const EditScreenModal = ({showModal, setShowModal, item}) => {
  const realm = useRealm();
  const NotesArray = useQuery(Notes);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';

  const innerStyle = StyleSheet.create({
    infoBox: {
      backgroundColor: colorScheme == 'dark' ? '#222' : '#fff',
      height: 'auto',
      borderRadius: 10,
      paddingVertical: 15,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
    },
  });

  return (
    <View>
      <Modal
        onBackButtonPress={() => setShowModal(false)}
        onBackdropPress={() => setShowModal(false)}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        backdropOpacity={0.1}
        animationInTiming={100}
        useNativeDriverForBackdrop
        animationOutTiming={100}
        avoidKeyboard={true}
        isVisible={showModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View style={innerStyle.infoBox}>
            <View style={{paddingHorizontal: 15, gap: 7, paddingBottom: 10}}>
              <Text
                style={{
                  color: currentTextColor,
                  fontSize: 22,
                  fontWeight: '500',
                }}>
                Delete note
              </Text>
              <Text
                style={{
                  color: currentTextColor,
                  fontSize: 20,
                  fontWeight: '400',
                }}>
                Are you sure to delete this notes?
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
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{color: '#888', fontSize: 20, fontWeight: '500'}}>
                  CANCEL
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  realm.write(() => {
                    realm.delete(item);
                  });

                  NotesArray;
                  navigation.goBack();
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

export default EditScreenModal;

const styles = StyleSheet.create({});
