import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableHighlightComponent,
  View,
  useColorScheme,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {deleteNote, editNote} from '../redux/features/notescCollection';

const EditNote = () => {
  const colorScheme = useColorScheme();
  const route = useRoute();
  const {item} = route.params;
  const themeColor = '#60B1D6';
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#222';
  const currentBgColor = colorScheme == 'dark' ? '#111' : '#fff';
  const navigation = useNavigation();
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const [titleIsFocus, setTitleIsFocus] = useState(false);
  const [bodyIsFocus, setBodyIsFocus] = useState(false);
  const focusRef = useRef(null);
  const notes = useSelector(state => state.notesCollection.notesArray);

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

  function handleDelete() {
    setMenuVisible(!menuVisible);
    dispatch(deleteNote(item));
    navigation.goBack();
  }

  function handleEdit() {
    const editedObj = {title: title, body: body};
    const index = notes.findIndex(obj => obj.id == item.id);
    title == notes[index].title && body == notes[index].body
      ? null
      : dispatch(editNote({id: item.id, title: title, body: body}));

    setBodyIsFocus(false);
    setTitleIsFocus(false);
    focusRef.current.blur();
    console.log(notes);
  }

  const MenuModal = () => {
    return (
      <View style={{flex: 0, backgroundColor: 'red'}}>
        <Modal
          isVisible={menuVisible}
          backdropColor="transparent"
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          onBackdropPress={() => setMenuVisible(!menuVisible)}
          animationInTiming={200}
          onBackButtonPress={() => setMenuVisible(false)}
          animationOutTiming={200}>
          <View style={{flex: 1}}>
            <View style={{position: 'absolute', right: 0, top: 30}}>
              <View
                style={{
                  width: 200,
                  height: 'auto',
                  backgroundColor: colorScheme == 'dark' ? '#222' : '#F5F5F5',
                  borderRadius: 10,
                  alignItems: 'flex-start',
                }}>
                <Pressable
                  onPress={handleDelete}
                  style={({pressed}) => [
                    {
                      backgroundColor: pressed
                        ? 'rgba(96, 177, 214, 0.3)'
                        : 'transparent',
                      width: '100%',
                      padding: 15,
                    },
                  ]}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: currentTextColor,
                      }}>
                      Delete
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <SafeAreaView style={{backgroundColor: currentBgColor, flex: 1}}>
      <MenuModal />
      <View style={innerStyle.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Pressable onPress={goBack}>
            <Icon name="arrow-left" color={themeColor} size={25} />
          </Pressable>
          <Text
            style={{color: currentTextColor, fontSize: 22, fontWeight: '500'}}>
            Edit Note
          </Text>
        </View>
        {!titleIsFocus && !bodyIsFocus ? (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 30}}>
            <Icon2 name="share-social-outline" color={themeColor} size={25} />
            <Pressable onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="ellipsis-vertical" color={themeColor} size={25} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleEdit}>
            <Icon name="check" color={themeColor} size={25} />
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
          defaultValue={title}
          onFocus={() => setBodyIsFocus(true)}
          onBlur={() => setTitleIsFocus(false)}
          onChangeText={newText => setTitle(newText)}
          ref={focusRef}
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
          onFocus={() => setTitleIsFocus(true)}
          onBlur={() => setBodyIsFocus(false)}
          onChangeText={newText => setBody(newText)}
          ref={focusRef}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditNote;

const styles = StyleSheet.create({});
