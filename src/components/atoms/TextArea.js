import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Apptheme from '../../assets/theme/Apptheme';


const TextArea = ({
  value,
  onChangeText,
  placeholder,
  numberOfLines = 4,
  multiline = true,
  style,
  
  ...props
}) => {
  return (
    <TextInput
      style={[styles.textArea, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={'black'}
      multiline={multiline}
      numberOfLines={numberOfLines}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: '#f8f8f8',
    borderRadius: Apptheme.spacing.m2,
    borderColor: Apptheme.color.boxOutline,
    borderWidth: 0.5,
    padding: 10,
    // height:40,
    textAlignVertical: 'top', // Makes multiline look correct on Android
    fontSize: 14,
    color:'black'
  },
});

export default TextArea;
