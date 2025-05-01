

import Apptheme from './Apptheme';
import {Font} from './font';

const FontStyle = {
  headingLarge: {
    fontFamily: Font.EXTRABOLD,
    fontSize: 22,
    color: Apptheme.color.text,
    letterSpacing: 0,
    includeFontPadding: false,
    
    
  },
  heading: {
    fontFamily: Font.BOLD,
    fontSize: 18,
    color: Apptheme.color.text,
    letterSpacing: 0,
    includeFontPadding: false,
    
  },
  headingSmall: {
    fontFamily: Font.SEMIBOLD,
    fontSize: 14,
    color: Apptheme.color.text,
    letterSpacing: 0,
    includeFontPadding: false,
    
  },
  labelMedium: {
    fontSize: 14,
    color: Apptheme.color.text,
    fontFamily: Font.MEDIUM,
    letterSpacing: 0,
    includeFontPadding: false,
    
  },
  labelLarge: {
    fontSize: 16,
    color: Apptheme.color.text,
    fontFamily: Font.MEDIUM,
    letterSpacing: 0,
    includeFontPadding: false,
    
  },
  label: {
    fontSize: 12,
    color: Apptheme.color.text,
    fontFamily: Font.MEDIUM,
    letterSpacing: 0,
    includeFontPadding: false,
    
  },
  titleLarge: {
    fontFamily: Font.REGULAR,
    fontSize: 16,
    color: Apptheme.color.text, 
    letterSpacing: 0,
    includeFontPadding: false,
  },
  title: {
    fontFamily: Font.REGULAR,
    includeFontPadding: false,
    fontSize: 14,
    color: Apptheme.color.text, 
    letterSpacing: 0,
    includeFontPadding: false,
  },
  titleSmall: {
    fontFamily: Font.REGULAR,
    includeFontPadding: false,
    fontSize: 12,
    color: Apptheme.color.text,
    letterSpacing: 0,
    includeFontPadding: false,
  },
 
};

export default FontStyle;
