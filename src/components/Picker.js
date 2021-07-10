import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Button, Icon} from "react-native-elements";

export default function Picker(props) {
  const [modalVisible, setModalVisible] = useState(props.show);
  useEffect(() => {
    setModalVisible(props.show)
  }, [props.show])
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%', alignItems: 'flex-start'}}>
              <Icon
                style={{marginLeft: 0}}
                name='close'
                color={'#000'}
                type='antdesign'
                size={30}
                onPress={() => {
                  props.onClose()
                }}
              />
            </View>
            <Button
              onPress={() => {
                props.openCamera()
              }}
              buttonStyle={styles.btn} type={'clear'} title={'Open Camera'}/>
            <Button
              onPress={() => {
                props.openGallery()
              }}
              buttonStyle={styles.btn} type={'clear'} title={'Choose from gallery'}/>
            <Button
              onPress={() => {
                props.openSearch()
              }}
              buttonStyle={styles.btn} type={'clear'} title={'Search celebrity'}/>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btn: {
    height: 50
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
