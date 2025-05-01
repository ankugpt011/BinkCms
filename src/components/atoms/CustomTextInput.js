import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';
import Apptheme from '../../assets/theme/Apptheme';
 // adjust this import path as per your setup

const CustomTextInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  leftIconName,
  rightIconName,
  onRightIconPress,
  iconColor = '#4D4D4D',
  iconSize = 20,
  style,
  inputStyle,
  showTogglePassword = false,
  RightButton=false,
  onRightButtonPress,
  rightButtonText
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <View style={[styles.container, style]}>
      {leftIconName && (
        <VectorIcon
          material-community-icon
          name={leftIconName}
          size={iconSize}
          color={iconColor}
          style={styles.leftIcon}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible}
        style={[styles.input, inputStyle]}
        placeholderTextColor="#999"
      />
      {showTogglePassword ? (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <VectorIcon
            material-community-icon
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      ) : rightIconName ? (
        <TouchableOpacity onPress={onRightIconPress}>
          <VectorIcon
            material-community-icon
            name={rightIconName}
            size={iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      ) : RightButton?(
        <TouchableOpacity onPress={onRightButtonPress} style={{height:35,width:100,backgroundColor:'black',borderRadius:8,justifyContent:'center',alignItems:'center'}}>
            <Text style={[FontStyle.label,{color:Apptheme.color.background}]}>{rightButtonText}</Text>
        </TouchableOpacity>
      ):null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  leftIcon: {
    marginRight: 5,
  },
});
