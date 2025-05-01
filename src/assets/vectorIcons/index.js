import {View, Text} from 'react-native';
import React from 'react';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import FA6 from 'react-native-vector-icons/FontAwesome5Pro';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
// import Apptheme from '../theme/apptheme';

const VectorIcon = (
  props = {
    'material-icon': '',
    'material-community-icon': '',
    'font-awesome-icon': '',
    'ion-icons': '',
    'ant-design': '',
    entypo: '',
    'font-awesome-icon6': '',
    name: '',
    color: '',
  },
) => {
  if (props.hasOwnProperty('font-awesome-icon')) {
    return <FA5 name={props.name} color={'black'} {...props} />;
  }
  if (props.hasOwnProperty('font-awesome-icon6')) {
    return <FA6 name={props.name} color={'black'} {...props} />;
  }

  if (props.hasOwnProperty('material-community-icon')) {
    return (
      <MaterialCommunityIcon
        name={props.name}
        color={'black'}
        {...props}
      />
    );
  }
  if (props.hasOwnProperty('ion-icons')) {
    return (
      <Ionicons name={props.name} color={'black'} {...props} />
    );
  }
  if (props.hasOwnProperty('ant-design')) {
    return (
      <AntDesign name={props.name} color={'black'} {...props} />
    );
  }
  if (props.hasOwnProperty('entypo')) {
    return <Entypo name={props.name} color={'black'} {...props} />;
  }

  return (
    <MaterialIcon
      size={28}
      color={'black'}
      name={props.name}
      {...props}
    />
  );
};

export default VectorIcon;
