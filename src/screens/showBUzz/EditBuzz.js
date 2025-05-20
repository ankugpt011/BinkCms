// import {
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useRef} from 'react';
// import Apptheme from '../../assets/theme/Apptheme';
// import FontStyle from '../../assets/theme/FontStyle';
// import Gap from '../../components/atoms/Gap';
// import VectorIcon from '../../assets/vectorIcons';
// import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import TextArea from '../../components/atoms/TextArea';
// import { useSelector } from 'react-redux';
// import ImagePicker from 'react-native-image-crop-picker';
// import useApi from '../../apiServices/UseApi';

// const { width: screenWidth } = Dimensions.get('window');

// const EditBuzz = ({placeholder = 'Start typing here...'}) => {
//   console.log('hellooonkn');
//   const richText = useRef();
//   const userData = useSelector(state => state.login.userData);
//   const { postData } = useApi({ method: 'POST', manual: true });

//   const handleImageUpload = async () => {
//     try {
//       const image = await ImagePicker.openPicker({
//         width: screenWidth - 40, // Account for padding
//         height: 300,
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
//     <View style={{flex: 1, backgroundColor: Apptheme.color.background}}>
//       <View
//         style={{
//           backgroundColor: Apptheme.color.primary,
//           padding: 20,
//         }}>
//         <Text style={[FontStyle.heading, {color: Apptheme.color.background}]}>
//           EditBuzz
//         </Text>
//         <Gap m1 />
//         <Text style={[FontStyle.label, {color: '#f2f2f2'}]}>
//           Add or Edit the buzz here!
//         </Text>
//       </View>
//       <ScrollView
//         style={{
//           // paddingHorizontal: 10,
//           backgroundColor: Apptheme.color.containerBackground,
//         }}>
//         <View
//           style={{
//             backgroundColor: Apptheme.color.background,
//             padding: 10,
//             flex: 1,
//           }}>
//             <Text style={[FontStyle.labelLarge]}>Story</Text>
//             <Gap m1/>
//           <RichToolbar
//             editor={richText}
//             actions={[
//               actions.setBold,
//               actions.setItalic,
//               actions.setUnderline,
//               actions.setStrikethrough,
//               actions.heading1,
//               actions.insertBulletsList,
//               actions.insertOrderedList,
//               // actions.insertLink,
//               actions.undo,
//               actions.redo,
//               actions.insertImage,
//             ]}
//             iconMap={{
//               [actions.insertImage]: () => (
//                 <Icon name="image" size={22} color="#000" />
//               ),
//             }}
//             onPressAddImage={handleImageUpload}
//             iconTint="#000"
//             selectedIconTint={Apptheme.color.primary}
//             style={styles.richToolbar}
//           />
//           <ScrollView
//             style={styles.editorWrapper}
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled">
//             <RichEditor
//               ref={richText}
//               placeholder={placeholder}
//               // onChange={handleChange}
//               androidHardwareAccelerationDisabled={true}
//               style={styles.richEditor}
//               initialHeight={350}
//               useContainer={true}
//               initialContentHTML={''}
//               editorStyle={styles.webViewStyle}
//               containerStyle={styles.editorContainer}
//             />
//           </ScrollView>
//         </View>
//         <Gap m3 />
//         <View
//           style={{
//             backgroundColor: Apptheme.color.background,
//             padding: 10,
//           }}>
//           <Text style={[FontStyle.labelLarge]}>Heading</Text>
//           <Gap m1 />
//           <TextArea numberOfLines={2}/>
//         </View>
//         <Gap m9 />
//         <Gap m9 />
//         <Gap m9 />
//       </ScrollView>
//       <View
//         style={{
//           padding: 10,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}>
//         <View
//           style={{
//             flex: 1,
//             paddingVertical: 10,
//             borderRadius: 8,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderWidth: 0.7,
//             flexDirection: 'row',
//           }}>
//           <VectorIcon
//             material-community-icon
//             name="content-save"
//             style={styles.icon}
//             size={16}
//           />
//           <Gap row m2 />
//           <Text style={[FontStyle.labelMedium]}>Save</Text>
//         </View>
//         <Gap row m5 />
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: Apptheme.color.primary,
//             paddingVertical: 10,
//             borderRadius: 8,
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexDirection: 'row',
//           }}>
//           <VectorIcon
//             material-community-icon
//             name="send"
//             color="white"
//             size={16}
//           />
//           <Gap row m2 />

//           <Text
//             style={[FontStyle.labelMedium, {color: Apptheme.color.background}]}>
//             Publish
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default EditBuzz;

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

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import VectorIcon from '../../assets/vectorIcons';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextArea from '../../components/atoms/TextArea';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import useApi from '../../apiServices/UseApi';
import {updateBuzz} from '../../apiServices/apiHelper';
import {useNavigation, useRoute} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';


const {width: screenWidth} = Dimensions.get('window');

const EditBuzz = ({placeholder = 'Start typing here...'}) => {
  // Refs and state
  const richText = useRef();
  const navigation = useNavigation();
  const headingRef = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [heading, setHeading] = useState('');
  const [story, setStory] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const route = useRoute();

  // Get user data and API methods
  const userData = useSelector(state => state.login.userData);
  const {postData} = useApi({method: 'POST', manual: true});

  // Get buzz data if editing (from route params)
  const buzzData = route?.params?.buzzDetail || null;
  const isEditMode = !!buzzData;
  const newsId = route?.params?.newsId;
  // Handle image upload
  useEffect(() => {
    setHeading(buzzData?.heading);
  }, [buzzData]);

  console.log('buzzData34567', buzzData);

  const handleImageUpload = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: screenWidth - 40,
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

  // Upload image to server
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

  // Handle story content change
  const handleStoryChange = html => {
    setStory(html);
  };

  // Save or publish buzz
  const handleSubmit = async (status = 'DRAFT') => {
    try {
      if (status === 'PUBLISHED') {
        setIsPublishing(true);
      } else {
        setIsSaving(true);
      }

      const payload = {
        sessionId: userData?.sessionId,
        newsId: newsId,
        heading: heading,
        story: story,
        state: status,
        ...(isEditMode && {buzzId: buzzData?.id}), // Include buzzId if editing
      };
      console.log('payloadpayload',payload)
      const response = await postData(payload, updateBuzz());

      if (response) {
        navigation.goBack()
        // navigation.navigate(RouteName.SHOW_BUZZ
        //   , {
        //   detail: 'refresh',
        //   newsId: newsId,
        // });
        // Alert.alert(
        //   'Success',
        //   status === 'PUBLISHED'
        //     ? 'Buzz published successfully!'
        //     : 'Draft saved successfully!'
        // );
        // You might want to navigate back or reset form here
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save buzz. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsPublishing(false);
      setIsSaving(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Apptheme.color.background}}>
      <View
        style={{
          backgroundColor: Apptheme.color.primary,
          padding: 20,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <VectorIcon
              material-icon
              name="arrow-back-ios"
              color={Apptheme.color.background}
              size={18}
              style={{marginRight: 10}}
            />
          </TouchableOpacity>

          <Text style={[FontStyle.heading, {color: Apptheme.color.background}]}>
            {isEditMode ? 'Edit Buzz' : 'Create Buzz'}
          </Text>
        </View>
        <Gap m1 />
        <Text style={[FontStyle.label, {color: '#f2f2f2'}]}>
          {isEditMode ? 'Edit your buzz content' : 'Create a new buzz post'}
        </Text>
      </View>

      <ScrollView style={{backgroundColor: Apptheme.color.containerBackground}}>
        <View
          style={{
            backgroundColor: Apptheme.color.background,
            padding: 10,
            flex: 1,
          }}>
          <Text style={[FontStyle.labelLarge]}>Heading</Text>
          <Gap m1 />

          <TextInput
            style={[styles.textArea]}
            value={heading}
            onChangeText={setHeading}
            placeholder={'Enter buzz heading...'}
            placeholderTextColor={'black'}
            multiline
            numberOfLines={2}
          />

          <Gap m2 />

          <Text style={[FontStyle.labelLarge]}>Story</Text>
          <Gap m1 />
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
              actions.undo,
              actions.redo,
              actions.insertImage,
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

          <ScrollView
            style={styles.editorWrapper}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <RichEditor
              ref={richText}
              placeholder={placeholder}
              onChange={handleStoryChange}
              androidHardwareAccelerationDisabled={true}
              style={styles.richEditor}
              initialHeight={350}
              useContainer={true}
              initialContentHTML={buzzData?.story || ''}
              editorStyle={styles.webViewStyle}
              containerStyle={styles.editorContainer}
            />
          </ScrollView>
        </View>
      </ScrollView>

      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.7,
            flexDirection: 'row',
            opacity: isSaving ? 0.6 : 1,
          }}
          onPress={() => handleSubmit('DRAFT')}
          disabled={isSaving || isPublishing}>
          <VectorIcon
            material-community-icon
            name="content-save"
            style={styles.icon}
            size={16}
          />
          <Gap row m2 />
          <Text style={[FontStyle.labelMedium]}>
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Text>
        </TouchableOpacity>

        <Gap row m5 />

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: Apptheme.color.primary,
            paddingVertical: 10,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            opacity: isPublishing ? 0.6 : 1,
          }}
          onPress={() => handleSubmit('PUBLISHED')}
          disabled={isPublishing || isSaving}>
          <VectorIcon
            material-community-icon
            name="send"
            color="white"
            size={16}
          />
          <Gap row m2 />
          <Text
            style={[FontStyle.labelMedium, {color: Apptheme.color.background}]}>
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditBuzz;

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
  textArea: {
    backgroundColor: '#f8f8f8',
    borderRadius: Apptheme.spacing.m2,
    borderColor: Apptheme.color.boxOutline,
    borderWidth: 0.5,
    padding: 10,
    // height:40,
    textAlignVertical: 'top', // Makes multiline look correct on Android
    fontSize: 14,
    color: 'black',
  },
});
