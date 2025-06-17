import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import ImagePicker from 'react-native-image-crop-picker';
import FontStyle from '../../assets/theme/FontStyle';
import Apptheme from '../../assets/theme/Apptheme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import useApi from '../../apiServices/UseApi';
import Gap from './Gap';
import NetInfo from '@react-native-community/netinfo';

const {width: screenWidth} = Dimensions.get('window');

const TextEditor = ({
  placeholder = 'Start typing here...',
  onChange,
  initialContent,
  key,
}) => {
  const richText = useRef();
  const [editorContent, setEditorContent] = useState(initialContent || '');
  const [htmlContent, setHtmlContent] = useState(initialContent || '');
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const userData = useSelector(state => state.login.userData);
  const [htmlMode, setHtmlMode] = useState(false);
  const {postData} = useApi({method: 'POST', manual: true});
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isConnected,setIsConnected]=useState(true)

  useEffect(() => {
    if (initialContent !== editorContent) {
      setEditorContent(initialContent || '');
      setHtmlContent(initialContent || '');
    }
  }, [initialContent]);

  const handleChange = text => {
    setEditorContent(text);
    setHtmlContent(text);
    if (onChange) onChange(text);
  };

 

   const checkInternet = async () => {
    const state = await NetInfo.fetch();
    console.log('checkInternet', state);
    if (!state.isConnected) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Offline Mode',
      //   text2: 'This functionality is not available in offline mode',
      // });
      ToastAndroid.show(
        'This functionality is not available in offline mode',
        ToastAndroid.SHORT,
      );
      return false;
    }
    return true;
  };


  const handleImageUpload = async () => {

    const online = await checkInternet();
    if (!online) return;
   
    try {
      const image = await ImagePicker.openPicker({
        width: 500,
        height: 300,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      const response = await uploadImage(image);

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
            richText.current?.setContentHTML('');
            setEditorContent('');
            setHtmlContent('');
            if (onChange) onChange('');
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleInsertLink = () => {
    if (!linkUrl) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${
      linkText || linkUrl
    }</a>`;

    richText.current?.insertHTML(linkHTML);
    setLinkModalVisible(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleHtmlSave = () => {
     // Add this import at the top: import { Keyboard } from 'react-native'
    
    setEditorContent(htmlContent);
    richText.current?.setContentHTML(htmlContent);
    setHtmlMode(false);
    if (onChange) onChange(htmlContent);
  };

  const uploadImage = async (
    imgData,
    orientation = null,
    mediaSource = 'UPLOAD',
  ) => {
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
          actions.insertImage,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.undo,
          actions.redo,
        ]}
        iconMap={{
          [actions.insertImage]: () => (
            <Icon name="image" size={22} color="#000" />
          ),
        }}
        onPressAddImage={handleImageUpload}
        iconTint="#000"
        selectedIconTint={Apptheme.color.primary}
        style={styles.richToolbar}
      />
      <View style={styles.toolbarExtension}>
        <TouchableOpacity onPress={() => setLinkModalVisible(true)}>
          <Icon name="link" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClear}>
          <Icon name="delete" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHtmlMode(true)}>
          <Icon
            name="code"
            size={20}
            color={htmlMode ? Apptheme.color.primary : '#000'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.editorWrapper}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <RichEditor
          ref={richText}
          placeholder={placeholder}
          onChange={handleChange}
          androidHardwareAccelerationDisabled={true}
          style={styles.richEditor}
          initialHeight={200}
          useContainer={true}
          initialContentHTML={editorContent}
          editorStyle={styles.webViewStyle}
          containerStyle={styles.editorContainer}
        />
      </ScrollView>

      {/* HTML Mode Modal */}
      <Modal
        visible={htmlMode}
        transparent
        animationType="slide"
        onRequestClose={() => setHtmlMode(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.htmlModal}>
            <View style={styles.modalHeader}>
              <Text style={FontStyle.headingSmall}>HTML Editor</Text>
              <TouchableOpacity onPress={() => setHtmlMode(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <Gap height={16} />
            <TextInput
              multiline
              style={styles.htmlInput}
              placeholder="Write your HTML code here..."
              placeholderTextColor="white"
              value={htmlContent}
              onChangeText={text => setHtmlContent(text)}
              autoCorrect={false}
              autoCapitalize="none"
              textAlignVertical="top"
            />
            <Gap m1 />
            <View style={styles.htmlModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton,{backgroundColor:Apptheme.color.boxOutline,alignItems:'center',justifyContent:'center',padding:5,borderRadius:4}]}
                onPress={() => setHtmlMode(false)}>
                <Text style={[styles.cancelButtonText,{color:'black'}]}>Cancel</Text>
              </TouchableOpacity>
              <Gap m2/>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={()=>{ Keyboard.dismiss();handleHtmlSave()}}>
                <Text style={[styles.saveButtonText,{color:'white'}]}>Apply HTML</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Link Insert Modal */}
      <Modal
        visible={linkModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setLinkModalVisible(false);
          setLinkUrl('');
          setLinkText('');
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.linkModal}>
            <Text style={[styles.modalLabel,{color:'gray'}]}>Enter Link URL:</Text>
            <TextInput
              value={linkUrl}
              onChangeText={setLinkUrl}
              placeholder="https://example.com"
              placeholderTextColor="#999"
              style={styles.modalInput}
              autoCapitalize="none"
              keyboardType="url"
            />

            <Text style={[styles.modalLabel,{color:'gray'}]}>Display Text:</Text>
            <TextInput
              value={linkText}
              onChangeText={setLinkText}
              placeholder="Click here"
              placeholderTextColor="#999"
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setLinkModalVisible(false);
                  setLinkUrl('');
                  setLinkText('');
                }}>
                <Text style={{color:'black'}}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton,{paddingHorizontal:10}]}
                onPress={handleInsertLink}>
                <Text style={{color:'white'}}>Insert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  toolbarExtension: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 5,
    borderTopWidth: 0.2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    flexDirection: 'row',
    gap: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  linkModal: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    color: 'black',
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems:'center'
  },
  htmlModal: {
    height: 370,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  htmlInput: {
    minHeight: 250,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 0,
    padding: 10,
    maxHeight:250,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: 'black',
    borderRadius: 6,
    color: 'white',
  },
  saveButton: {
    height: 30,
    backgroundColor: Apptheme.color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});

// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Dimensions,
//   TextInput,
//   TouchableOpacity,
//   Modal,
// } from 'react-native';
// import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
// import ImagePicker from 'react-native-image-crop-picker';
// import FontStyle from '../../assets/theme/FontStyle';
// import Apptheme from '../../assets/theme/Apptheme';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSelector} from 'react-redux';
// import useApi from '../../apiServices/UseApi';
// import Gap from './Gap';

// const {width: screenWidth} = Dimensions.get('window');

// const TextEditor = ({
//   placeholder = 'Start typing here...',
//   onChange,
//   initialContent,
//   key,
// }) => {
//   const richText = useRef();
//   const [editorKey, setEditorKey] = useState(0);
//   const [htmlMode, setHtmlMode] = useState(false);
//   const [htmlContent, setHtmlContent] = useState(initialContent || '');
//   const userData = useSelector(state => state.login.userData);
//   const {postData} = useApi({method: 'POST', manual: true});

//   const [linkModalVisible, setLinkModalVisible] = useState(false);
//   const [linkUrl, setLinkUrl] = useState('');
//   const [linkText, setLinkText] = useState('');

//   useEffect(() => {
//     if (!initialContent) {
//       setEditorKey(prevKey => prevKey + 1);
//     } else {
//       setHtmlContent(initialContent);
//     }
//   }, [initialContent, key]);

//   const handleChange = text => {
//     // Remove <script> tags and their content
//     const cleanedText = text.replace(
//       /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
//       '',
//     );
//     setHtmlContent(cleanedText);
//     if (onChange) onChange(cleanedText);
//   };

//   const handleInsertLink = () => {
//     setLinkUrl('');
//     setLinkText('');
//     setLinkModalVisible(true);
//   };

//   const toggleHtmlMode = () => {
//     setHtmlMode(prev => !prev);
//   };

//   const handleImageUpload = async () => {
//     try {
//       const image = await ImagePicker.openPicker({
//         width: screenWidth - 40,
//         height: 500,
//         cropping: true,
//         mediaType: 'photo',
//         compressImageQuality: 0.8,
//       });

//       const response = await uploadImage(image);
//       if (response) {
//         const imageHTML = `
//           <div style="width: 100%; margin: 10px 0; overflow: hidden; border-radius: 8px;">
//             <img
//               src="${response}"
//               style="width: 100%; height: auto; display: block;"
//               alt="uploaded-image"
//             />
//           </div>
//         `;
//         richText.current?.insertHTML(imageHTML);
//         setHtmlContent(prev => prev + imageHTML);
//       }
//     } catch (error) {
//       console.log('Image upload failed:', error);
//       if (error.code !== 'E_PICKER_CANCELLED') {
//         Alert.alert('Image Upload', 'Could not upload image.');
//       }
//     }
//   };

//   const uploadImage = async (
//     imgData,
//     orientation = null,
//     mediaSource = 'UPLOAD',
//   ) => {
//     try {
//       const sessionId = userData?.sessionId;
//       const apiName = `/content/servlet/RDESController?command=rdm.FileUpload&sessionId=${sessionId}&uploadType=7&orientation=${orientation}&mediaSource=${mediaSource}`;

//       let formData = new FormData();
//       formData.append('photo', {
//         uri: imgData.path,
//         type: imgData.mime,
//         name: imgData.path.split('/').pop(),
//       });

//       const response = await postData(formData, apiName, {
//         'Content-Type': 'multipart/form-data',
//         Accept: 'application/json',
//       });

//       return response;
//     } catch (err) {
//       console.error('Upload failed:', err);
//       return null;
//     }
//   };

//   const handleClear = () => {
//     Alert.alert(
//       'Clear Content',
//       'Are you sure you want to clear all content?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Clear',
//           onPress: () => {
//             setHtmlContent('');
//             setEditorKey(prevKey => prevKey + 1);
//             if (onChange) onChange('');
//           },
//           style: 'destructive',
//         },
//       ],
//     );
//   };

//   const handleHtmlSave = () => {
//     setHtmlMode(false);
//     setEditorKey(prev => prev + 1); // Force editor to reload with new content
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
//           actions.insertImage,
//           actions.insertBulletsList,
//           actions.insertOrderedList,
//           actions.undo,
//           actions.redo,
//         ]}
//         iconMap={{
//           [actions.insertImage]: () => (
//             <Icon name="image" size={22} color="#000" />
//           ),
//         }}
//         onPressAddImage={handleImageUpload}
//         iconTint="#000"
//         selectedIconTint={Apptheme.color.primary}
//         style={styles.richToolbar}
//       />
//       <View style={styles.toolbarExtension}>
//         <TouchableOpacity onPress={handleInsertLink}>
//           <Icon name="link" size={22} color="#000" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleClear}>
//           <Icon name="delete" size={20} color="#000" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={toggleHtmlMode}>
//           <Icon
//             name="code"
//             size={20}
//             color={htmlMode ? Apptheme.color.primary : '#000'}
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.editorWrapper}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled">
//         <RichEditor
//           key={editorKey}
//           ref={richText}
//           placeholder={placeholder}
//           onChange={handleChange}
//           androidHardwareAccelerationDisabled={true}
//           style={styles.richEditor}
//           initialHeight={200}
//           useContainer={true}
//           initialContentHTML={htmlContent}
//           editorStyle={styles.webViewStyle}
//           containerStyle={styles.editorContainer}
//         />
//       </ScrollView>

//       {/* HTML Edit Modal */}
//       <Modal
//         visible={htmlMode}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setHtmlMode(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.htmlModal}>
//             <View style={styles.modalHeader}>
//               <Text style={FontStyle.headingSmall}>HTML code</Text>
//               <TouchableOpacity onPress={() => setHtmlMode(false)}>
//                 <Icon name="close" size={20} color="#000" />
//               </TouchableOpacity>
//             </View>
//             <Gap m2 />
//             <TextInput
//               multiline
//               style={[styles.htmlInput,{backgroundColor:'black',color:'white'}]}
//               value={htmlContent}
//               onChangeText={text => {
//                 setHtmlContent(text);
//                 if (onChange) onChange(text);
//               }}
//             />
//             <Gap m2 />
//             <TouchableOpacity
//               onPress={handleHtmlSave}
//               style={styles.saveButton}>
//               <Text style={{color: 'white'}}>Save</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Link Insert Modal */}
//       <Modal
//         visible={linkModalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setLinkModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.linkModal}>
//             <Text style={{marginBottom: 8, color: 'black'}}>
//               Enter Link URL:
//             </Text>
//             <TextInput
//               value={linkUrl}
//               onChangeText={setLinkUrl}
//               placeholder="https://example.com"
//               placeholderTextColor={'black'}
//               style={styles.modalInput}
//             />
//             <Text style={{marginBottom: 8, color: 'black'}}>Display Text:</Text>
//             <TextInput
//               value={linkText}
//               onChangeText={setLinkText}
//               placeholderTextColor={'black'}
//               placeholder="Click here"
//               style={styles.modalInput}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity onPress={() => setLinkModalVisible(false)}>
//                 <Text style={{color: 'red'}}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
//                   richText.current?.insertHTML(linkHTML);
//                   setHtmlContent(prev => prev + linkHTML);
//                   setLinkModalVisible(false);
//                 }}>
//                 <Text style={{color: 'green'}}>Insert</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   toolbarExtension: {
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//     marginBottom: 5,
//     borderTopWidth: 0.2,
//     borderBottomLeftRadius: 4,
//     borderBottomRightRadius: 4,
//     flexDirection: 'row',
//     gap: 15,
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
//   htmlInput: {
//     minHeight: 250,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     margin: 0,
//     padding: 10,
//     textAlignVertical: 'top',
//     fontSize: 14,
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     color: 'black',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   htmlModal: {
//     height: 330,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     justifyContent: 'center',
//   },
//   linkModal: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   saveButton: {
//     height: 30,
//     backgroundColor: Apptheme.color.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 4,
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     marginBottom: 10,
//     color: 'black',
//     borderRadius: 4,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
// });

// export default TextEditor;
