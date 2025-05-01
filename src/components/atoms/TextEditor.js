import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import FontStyle from '../../assets/theme/FontStyle';
import Apptheme from '../../assets/theme/Apptheme';

const TextEditor = ({ placeholder = 'Start typing here...', onChange }) => {
  const richText = useRef();
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (text) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim(); // remove HTML
    setCharCount(plainText.length);
    setWordCount(plainText === '' ? 0 : plainText.split(/\s+/).length);
    if (onChange) onChange(text);
  };

  return (
    <View style={styles.container}>
         <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.heading1,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.undo,
          actions.redo,
        ]}
        iconTint="#000"
        selectedIconTint={Apptheme.color.primary}
        style={styles.richToolbar}
      />
      <ScrollView style={styles.editorWrapper}>
        <RichEditor
          ref={richText}
          placeholder={placeholder}
          onChange={handleChange}
          androidHardwareAccelerationDisabled={true}
          style={styles.richEditor}
          initialHeight={200}
        />
      </ScrollView>

     

      <View style={styles.counterContainer}>
        <Text style={FontStyle.titleSmall}>Character Count: {charCount}</Text>
        <Text style={FontStyle.titleSmall}>Word Count: {wordCount}</Text>
      </View>
    </View>
  );
};

export default TextEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  editorWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
  },
  richEditor: {
    minHeight: 200,
    fontSize: 16,
  },
  richToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
