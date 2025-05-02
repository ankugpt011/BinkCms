import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import Apptheme from '../../assets/theme/Apptheme';

const ScheduleModal = ({ isVisible, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Schedule</Text>

        <View style={styles.pickerWrapper}>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
            mode="datetime"
            minimumDate={new Date()}
            androidVariant="iosClone"
            textColor="#000"
            fadeToColor="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => onConfirm(selectedDate)}>
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ScheduleModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Apptheme.color.black,
  },
  pickerWrapper: {
    backgroundColor: Apptheme.color.primary, // Ensure white background for date picker
    borderRadius: 12,
    padding: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: Apptheme.color.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
