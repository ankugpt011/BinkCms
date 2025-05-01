// components/atoms/SearchInput.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import VectorIcon from '../../assets/vectorIcons';



const SearchInput = ({ placeholder, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <VectorIcon
        material-icon
        name="search"
        size={18}
        color="#ffffff"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={'#ffffff'}
        placeholder={placeholder}
        cursorColor={'#fff'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 36,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    padding: 0,
  },
});
