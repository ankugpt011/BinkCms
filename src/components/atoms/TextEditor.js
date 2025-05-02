import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import ImagePicker from 'react-native-image-crop-picker';
import FontStyle from '../../assets/theme/FontStyle';
import Apptheme from '../../assets/theme/Apptheme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import useApi from '../../apiServices/UseApi';

const { width: screenWidth } = Dimensions.get('window');

const TextEditor = ({ placeholder = 'Start typing here...', onChange,initialContent }) => {
  const richText = useRef();
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const userData = useSelector(state => state.login.userData);
  const { postData } = useApi({ method: 'POST', manual: true });

  console.log('initialContentTextEditor',initialContent)

  const handleChange = (text) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim();
    setCharCount(plainText.length);
    setWordCount(plainText === '' ? 0 : plainText.split(/\s+/).length);
    if (onChange) onChange(text);
  };

  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: screenWidth - 40, // Account for padding
        height: 500,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });
      console.log('image.path',image)

      const response = await uploadImage(image);

      console.log('imageResponse',response)

      if (response) {
        const imageHTML = `
          <div style="width: 100%;height:100%; margin: 10px 0; overflow: hidden; border-radius: 8px;">
            <img 
              src="${response}" 
              style="width: 100%; height: auto; max-width: 100%; display: block;"
              alt="uploaded-image"
            />
          </div>
        `;
        richText.current?.insertHTML(imageHTML);
      }
    } catch (error) {
      console.log('Image upload cancelled or failed:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Image Upload', 'Could not upload image.');
      }
    }
  };

  const uploadImage = async (imgData, orientation = null, mediaSource = 'UPLOAD') => {
    console.log('test4')
    
    console.log('imagedfgvhbjnkm',imgData)
    try {
      const sessionId = userData?.sessionId
      const apiName = `/content/servlet/RDESController?command=rdm.FileUpload&sessionId=${sessionId}&uploadType=7&orientation=${orientation}&mediaSource=${mediaSource}`;

      let formData = new FormData();
      formData.append('photo', {
        uri: imgData.path,
        type: imgData.mime,
        name: imgData.path.split('/').pop(),
      });

      console.log('formData',formData)

      const response = await postData(formData, apiName, {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        onUploadProgress: p => {
          const percent = Math.trunc((p.loaded * 100) / p.total);
          setUploadProgress(percent);
        },
      });

      return response;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
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
          actions.insertImage,
        ]}
        iconMap={{
          [actions.insertImage]: () => <Icon name="image" size={22} color="#000" />,
        }}
        onPressAddImage={handleImageUpload}
        iconTint="#000"
        selectedIconTint={Apptheme.color.primary}
        style={styles.richToolbar}
      />

      <ScrollView 
        style={styles.editorWrapper}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <RichEditor
          ref={richText}
          placeholder={placeholder}
          
          onChange={handleChange}
          androidHardwareAccelerationDisabled={true}
          style={styles.richEditor}
          initialHeight={200}
          useContainer={true}
          initialContentHTML={initialContent}
          
          editorStyle={styles.webViewStyle}
          containerStyle={styles.editorContainer}
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
    backgroundColor: '#fff',
  },
  editorWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  richEditor: {
    flex: 1,
    minHeight: 200,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  webViewStyle: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  richToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 5,
  },
});