import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomDateTimePicker = ({
  value,
  onChange,
  placeholder = 'Select Date & Time',
  mode = 'datetime',
  style,
}) => {
  const [open, setOpen] = useState(false);

  // Ensure value is a Date object
  const dateValue = value instanceof Date ? value : value ? new Date(value) : null;

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.touchable}>
        <TextInput
          style={[styles.input, style]}
          value={dateValue ? format(dateValue, 'yyyy/MM/dd HH:mm:ss') : ''}
          placeholder={placeholder}
          editable={false}
          placeholderTextColor={'black'}
          pointerEvents="none"
        />
        <Icon name="calendar-today" size={20} color="#888" style={styles.icon} />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={dateValue || new Date()}
        mode={mode}
        onConfirm={(selectedDate) => {
          onChange(selectedDate);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    height:40
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
    color: 'black',
  },
  icon: {
    position: 'absolute',
    right: 12,
  },
});

export default CustomDateTimePicker;
