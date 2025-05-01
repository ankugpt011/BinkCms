import React from 'react';
import {View} from 'react-native';
import Apptheme from '../../assets/theme/Apptheme';


let defaultProps = {
  ml: null,
  m9: null,
  m8: null,
  m7: null,
  m6: null,
  m5: null,
  m4: null,
  m3: null,
  m2: null,
  m1: null,
  ms: null,
  row: null,
};

const Gap = (props = defaultProps) => {
  let style = {};
  let margin = 12;
  if (props.hasOwnProperty('ml')) margin = Apptheme.spacing.ml;
  if (props.hasOwnProperty('m9')) margin = Apptheme.spacing.m9;
  if (props.hasOwnProperty('m8')) margin = Apptheme.spacing.m8;
  if (props.hasOwnProperty('m7')) margin = Apptheme.spacing.m7;
  if (props.hasOwnProperty('m6')) margin = Apptheme.spacing.m6;
  if (props.hasOwnProperty('m5')) margin = Apptheme.spacing.m5;
  if (props.hasOwnProperty('m4')) margin = Apptheme.spacing.m4;
  if (props.hasOwnProperty('m3')) margin = Apptheme.spacing.m3;
  if (props.hasOwnProperty('m2')) margin = Apptheme.spacing.m2;
  if (props.hasOwnProperty('m1')) margin = Apptheme.spacing.m1;
  if (props.hasOwnProperty('ms')) margin = Apptheme.spacing.ms;
  if (props.hasOwnProperty('container')) margin = AppTheme.spacing.container;
  if (props.hasOwnProperty('row')) {
    style = {marginLeft: margin};
  } else {
    style = {marginTop: margin};
  }
  return <View style={style} />;
};

export default React.memo(Gap);
