// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
// import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// import ImagePicker from 'react-native-image-crop-picker';
// import FontStyle from '../../assets/theme/FontStyle';
// import Apptheme from '../../assets/theme/Apptheme';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useSelector } from 'react-redux';
// import useApi from '../../apiServices/UseApi';

// const { width: screenWidth } = Dimensions.get('window');

// const TextEditor = ({ placeholder = 'Start typing here...', onChange,initialContent,key }) => {
//   const richText = useRef();
//   const [editorKey, setEditorKey] = useState(0);
//   const userData = useSelector(state => state.login.userData);
//   const { postData } = useApi({ method: 'POST', manual: true });

//   console.log('initialContentTextEditor',initialContent)

//   useEffect(() => {
//     if (initialContent === '' || initialContent === undefined) {
//       // Force editor reset by changing the key
//       setEditorKey(prevKey => prevKey + 1);
//     }
//   }, [initialContent, key]);

//   const handleChange = (text) => {
//     const plainText = text.replace(/<[^>]*>/g, '').trim();
   
//     if (onChange) onChange(text);
//   };

//   const handleImageUpload = async () => {
//     try {
//       const image = await ImagePicker.openPicker({
//         width: screenWidth - 40, // Account for padding
//         height: 500,
//         cropping: true,
//         mediaType: 'photo',
//         compressImageQuality: 0.8,
//       });
//       console.log('image.path',image)

//       const response = await uploadImage(image);

//       console.log('imageResponse',response)

//       if (response) {
//         const imageHTML = `
//           <div style="width: 100%;height:100%; margin: 10px 0; overflow: hidden; border-radius: 8px;">
//             <img 
//               src="${response}" 
//               style="width: 100%; height: auto; max-width: 100%; display: block;"
//               alt="uploaded-image"
//             />
//           </div>
//         `;
//         richText.current?.insertHTML(imageHTML);
//       }
//     } catch (error) {
//       console.log('Image upload cancelled or failed:', error);
//       if (error.code !== 'E_PICKER_CANCELLED') {
//         Alert.alert('Image Upload', 'Could not upload image.');
//       }
//     }
//   };

//   const uploadImage = async (imgData, orientation = null, mediaSource = 'UPLOAD') => {
//     console.log('test4')
    
//     console.log('imagedfgvhbjnkm',imgData)
//     try {
//       const sessionId = userData?.sessionId
//       const apiName = `/content/servlet/RDESController?command=rdm.FileUpload&sessionId=${sessionId}&uploadType=7&orientation=${orientation}&mediaSource=${mediaSource}`;

//       let formData = new FormData();
//       formData.append('photo', {
//         uri: imgData.path,
//         type: imgData.mime,
//         name: imgData.path.split('/').pop(),
//       });

//       console.log('formData',formData)

//       const response = await postData(formData, apiName, {
//         'Content-Type': 'multipart/form-data',
//         Accept: 'application/json',
//         onUploadProgress: p => {
//           const percent = Math.trunc((p.loaded * 100) / p.total);
//           setUploadProgress(percent);
//         },
//       });

//       return response;
//     } catch (err) {
//       console.error('Upload failed:', err);
//       return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <RichToolbar
//         editor={richText}
//         actions={[
//           actions.setBold,
//           actions.setItalic,
//           actions.setUnderline,
//           actions.setStrikethrough,
//           actions.heading1,
//           actions.insertBulletsList,
//           actions.insertOrderedList,
//           actions.insertLink,
//           actions.undo,
//           actions.redo,
//           actions.insertImage,
//         ]}
//         iconMap={{
//           [actions.insertImage]: () => <Icon name="image" size={22} color="#000" />,
//         }}
//         onPressAddImage={handleImageUpload}
//         iconTint="#000"
//         selectedIconTint={Apptheme.color.primary}
//         style={styles.richToolbar}
//       />

//       <ScrollView 
//         style={styles.editorWrapper}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         <RichEditor
//         key={editorKey}
//           ref={richText}
//           placeholder={placeholder}
          
//           onChange={handleChange}
//           androidHardwareAccelerationDisabled={true}
//           style={styles.richEditor}
//           initialHeight={200}
//           useContainer={true}
//           initialContentHTML={initialContent}
          
//           editorStyle={styles.webViewStyle}
//           containerStyle={styles.editorContainer}
//         />
//       </ScrollView>

//       {/* <View style={styles.counterContainer}>
//         <Text style={FontStyle.titleSmall}>Character Count: {charCount}</Text>
//         <Text style={FontStyle.titleSmall}>Word Count: {wordCount}</Text>
//       </View> */}
//     </View>
//   );
// };

// export default TextEditor;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   editorWrapper: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   richEditor: {
//     flex: 1,
//     minHeight: 200,
//     fontSize: 16,
//     backgroundColor: 'transparent',
//   },
//   editorContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   webViewStyle: {
//     backgroundColor: 'transparent',
//     width: '100%',
//   },
//   richToolbar: {
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     backgroundColor: '#f5f5f5',
//     borderTopLeftRadius: 6,
//     borderTopRightRadius: 6,
//   },
//   counterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     paddingHorizontal: 5,
//   },
// });


import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import ImagePicker from 'react-native-image-crop-picker';
import FontStyle from '../../assets/theme/FontStyle';
import Apptheme from '../../assets/theme/Apptheme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import useApi from '../../apiServices/UseApi';

const { width: screenWidth } = Dimensions.get('window');

const TextEditor = ({ placeholder = 'Start typing here...', onChange, initialContent, key }) => {
  const richText = useRef();
  const [editorKey, setEditorKey] = useState(0);
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialContent || '');
  const userData = useSelector(state => state.login.userData);
  const { postData } = useApi({ method: 'POST', manual: true });

  useEffect(() => {
    if (!initialContent) {
      setEditorKey(prevKey => prevKey + 1);
    } else {
      setHtmlContent(initialContent);
    }
  }, [initialContent, key]);

  // const handleChange = (text) => {
  //   const plainText = text.replace(/<[^>]*>/g, '').trim();
  //   setHtmlContent(text);
  //   if (onChange) onChange(text);
  // };

  const handleChange = (text) => {
    // Remove <script> tags and their content
    const cleanedText = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    const plainText = cleanedText.replace(/<[^>]*>/g, '').trim();
  
    setHtmlContent(cleanedText);
    if (onChange) onChange(cleanedText);
  };

  const toggleHtmlMode = () => {
    setHtmlMode(prev => !prev);
  };

  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: screenWidth - 40,
        height: 500,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      const response = await uploadImage(image);
      if (response) {
        const imageHTML = `
          <div style="width: 100%; margin: 10px 0; overflow: hidden; border-radius: 8px;">
            <img 
              src="${response}" 
              style="width: 100%; height: auto; display: block;"
              alt="uploaded-image"
            />
          </div>
        `;
        richText.current?.insertHTML(imageHTML);
        setHtmlContent(prev => prev + imageHTML);
      }
    } catch (error) {
      console.log('Image upload failed:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Image Upload', 'Could not upload image.');
      }
    }
  };

  const uploadImage = async (imgData, orientation = null, mediaSource = 'UPLOAD') => {
    try {
      const sessionId = userData?.sessionId;
      const apiName = `/content/servlet/RDESController?command=rdm.FileUpload&sessionId=${sessionId}&uploadType=7&orientation=${orientation}&mediaSource=${mediaSource}`;

      let formData = new FormData();
      formData.append('photo', {
        uri: imgData.path,
        type: imgData.mime,
        name: imgData.path.split('/').pop(),
      });

      const response = await postData(formData, apiName, {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      });

      return response;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Content',
      'Are you sure you want to clear all content?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            setHtmlContent('');
            setEditorKey(prevKey => prevKey + 1); // Force reset
            if (onChange) onChange('');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={toggleHtmlMode} style={[styles.toggleButton,{flex:1}]}>
        <Text style={styles.toggleText}>{htmlMode ? 'Switch to Editor' : 'Edit HTML Code'}</Text>
        
      </TouchableOpacity>
      <TouchableOpacity onPress={handleClear} style={[styles.clearButton,{marginBottom:10}]}>
          <Text style={{color:'black'}}>Clear</Text>
        </TouchableOpacity>
        </View>

      {!htmlMode && (
        <>
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
              key={editorKey}
              ref={richText}
              placeholder={placeholder}
              onChange={handleChange}
              androidHardwareAccelerationDisabled={true}
              style={styles.richEditor}
              initialHeight={200}
              useContainer={true}
              initialContentHTML={htmlContent}
              editorStyle={styles.webViewStyle}
              containerStyle={styles.editorContainer}
            />
          </ScrollView>
        </>
      )}

      {htmlMode && (
        <TextInput
          multiline
          style={styles.htmlInput}
          value={htmlContent}
          onChangeText={text => {
            setHtmlContent(text);
            if (onChange) onChange(text);
          }}
        />
      )}
       
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
  htmlInput: {
    flex: 1,
    minHeight: 250,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: '#fdfdfd',
    borderRadius: 6,
    color:'black'
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 6,
    margin: 10,
    marginTop:0
  },clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  toggleText: {
    color: Apptheme.color.primary,
    fontWeight: 'bold',
  },
});
