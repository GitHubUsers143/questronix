import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/colors';

interface StatusModalInterface {
  showing: boolean;
  setShowing: React.Dispatch<React.SetStateAction<boolean>>;
  message: string | undefined;
  description: string | undefined;
  buttonText: string | undefined;
}

const StatusModal: React.FC<StatusModalInterface> = ({
  showing,
  setShowing,
  message = 'Something Went Wrong!',
  description = 'Something went wrong while trying to do something, please try again.',
  buttonText = 'OK',
}) => {
  const closeModal = () => {
    setShowing(false);
  };

  return (
    <Modal
      testID='status-modal'
      animationType='slide'
      transparent={true}
      visible={showing}
      onRequestClose={() => {
        closeModal();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTextHeader}>{message.toUpperCase()}</Text>
          <Text>{description}</Text>
          <Pressable
            testID='status-modal-button'
            style={[styles.button, styles.buttonClose]}
            onPress={() => closeModal()}
          >
            <Text style={styles.closeTextStyle}>
              {buttonText.toUpperCase()}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.WHITE,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.WHITE,
  },
  closeTextStyle: {
    color: COLORS.BLUE,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 5,
  },
  modalTextHeader: {
    color: COLORS.BLUE,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default StatusModal;
