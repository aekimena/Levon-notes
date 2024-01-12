import {Pressable, Text, View, useColorScheme} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';

const MenuModal = ({menuVisible, setMenuVisible, handleDelete}) => {
  const colorScheme = useColorScheme();
  const currentTextColor = colorScheme == 'dark' ? '#fff' : '#333';
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

export default MenuModal;
