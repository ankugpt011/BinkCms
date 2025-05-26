// components/atoms/SearchInput.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import VectorIcon from '../../assets/vectorIcons';
import Apptheme from '../../assets/theme/Apptheme';



const SearchInput = ({ placeholder, value, onChangeText,backgroundColor=Apptheme.color.searchColor,placeholderTextColor='#ffffff',iconColor="#ffffff",textColor='#fff' }) => {
  return (
    <View style={[styles.container,{backgroundColor:backgroundColor}]}>
      <VectorIcon
        material-icon
        name="search"
        size={18}
        color={iconColor}
      />
      <TextInput
        style={[styles.input,{color:textColor}]}
        placeholderTextColor={placeholderTextColor}
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
    backgroundColor: Apptheme.color.searchColor,
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
