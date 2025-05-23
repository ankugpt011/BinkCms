import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  FlatList,
  ToastAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import VectorIcon from '../../assets/vectorIcons';
import useApi from '../../apiServices/UseApi';
import {useSelector} from 'react-redux';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from './Gap';
import YoutubePlayer from 'react-native-youtube-iframe';
import NetInfo from '@react-native-community/netinfo';

const MediaSelector = ({onMediaSelect, initialMedia, fieldElement,files,key}) => {
  
  const [mediaItems, setMediaItems] = useState([]);
  const [newmediaItems, setNewMediaItems] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showImageDetailModal, setShowImageDetailModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const userData = useSelector(state => state.login.userData);
  const {postData} = useApi({method: 'POST', manual: true});

  console.log('files2345676543',files)
  // Initialize with `initialMedia` (could be an array or single item)

  console.log('initialMediainitialMedia',initialMedia)
  useEffect(() => {
    if(newmediaItems){
      return
    }
    if (initialMedia == undefined || initialMedia == null) {
      setMediaItems([]);
      return;
    }
    if (!initialMedia) {
      setMediaItems([]);
      return;
    }
  
    let parsedMedia = [];
    
    if (typeof initialMedia === 'string') {
      parsedMedia = initialMedia.split(',').map(item => {
        if (!item || item === 'null') return null;
        
        const matchingFile = files?.find(file => file.mediaId === item);
        
        if (item.startsWith('yt_')) {
          return {
            type: 'youtube',
            mediaId: item,
            url: item.replace('yt_', ''),
            ...(matchingFile && {caption: matchingFile.caption})
          };
        } else {
          return {
            type: 'image',
            mediaId: item,
            url: matchingFile ? matchingFile.url : item,
            ...(matchingFile && {
              thumbUrl: matchingFile.thumbUrl,
              caption: matchingFile.caption,
              alt: matchingFile.alt
            })
          };
        }
      }).filter(Boolean);
    }
    console.log('parsedMedia',parsedMedia)
    
    setMediaItems(parsedMedia);
  }, [initialMedia, files,key]);
 
  // useEffect(() => {
  //   if (!initialMedia) {
  //     setMediaItems([]); // Set empty array if initialMedia is null/undefined
  //     return;
  //   }
  
  //   let parsedMedia = [];
    
  //   if (typeof initialMedia === 'string') {
  //     parsedMedia = initialMedia.split(',').map(item => {
  //       // Skip empty items
  //       if (!item || item === 'null') return null;
        
  //       const matchingFile = files?.find(file => file.mediaId === item);
        
  //       if (item.startsWith('yt_')) {
  //         return {
  //           type: 'youtube',
  //           mediaId: item,
  //           url: item.replace('yt_', ''),
  //           ...(matchingFile && {caption: matchingFile.caption})
  //         };
  //       } else {
  //         return {
  //           type: 'image',
  //           mediaId: item,
  //           url: matchingFile ? matchingFile.url : item,
  //           ...(matchingFile && {
  //             thumbUrl: matchingFile.thumbUrl,
  //             caption: matchingFile.caption,
  //             alt: matchingFile.alt
  //           })
  //         };
  //       }
  //     }).filter(Boolean); // Remove any null entries
  //   } else if (Array.isArray(initialMedia)) {
  //     parsedMedia = initialMedia.map(item => {
  //       if (!item) return null; // Skip null items
        
  //       if (typeof item === 'string') {
  //         if (item === 'null') return null;
          
  //         const matchingFile = files?.find(file => file.mediaId === item);
  //         return {
  //           type: item.startsWith('yt_') ? 'youtube' : 'image',
  //           mediaId: item,
  //           url: item.startsWith('yt_') 
  //             ? item.replace('yt_', '') 
  //             : (matchingFile ? matchingFile.url : item),
  //           ...(matchingFile && {
  //             thumbUrl: matchingFile.thumbUrl,
  //             caption: matchingFile.caption,
  //             alt: matchingFile.alt
  //           })
  //         };
  //       }
  //       return item;
  //     }).filter(Boolean); // Remove any null entries
  //   }
  //   console.log('parsedMediaparsedMedia',parsedMedia)
  //   setMediaItems(parsedMedia);
  // }, [initialMedia, files]);


  const checkInternet = async () => {
    const state = await NetInfo.fetch();
    console.log('checkInternet',state)
    if (!state.isConnected) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Offline Mode',
      //   text2: 'This functionality is not available in offline mode',
      // });
      ToastAndroid.show('This functionality is not available in offline mode', ToastAndroid.SHORT);
      return false;
    }
    return true;
  };

  console.log('mediaItemssss',mediaItems)

  // Handle image selection from library
  const handleSelectFromLibrary = async () => {

    const online = await checkInternet();
  if (!online) return;

    try {
      const images = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      console.log('handleSelectFromLibrary',images)
      setUploading(true);
      const uploadedMedia = [];

      for (const image of Array.isArray(images) ? images : [images]) {
        const response = await uploadImage(image);
        setNewMediaItems(true)
        if (response) {
          ToastAndroid.show(
            'Image successfully uploaded',
            ToastAndroid.SHORT,
          );
          uploadedMedia.push({
            type: 'image',
            uri: image.path, // Local path for display
            mediaId: response.mediaId, // Server ID
            url: response.url, // Server URL if available
            mime: image.mime,
          });
        }
      }

      const updatedMedia = [...mediaItems, ...uploadedMedia];
      setMediaItems(updatedMedia);
      sendMediaToParent(updatedMedia);
    } catch (error) {
      console.error('Image selection error:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to select images');
      }
    } finally {
      setUploading(false);
    }
  };

  console.log('mediaIDssdsdss',mediaItems)

  const uploadImage = async (
    imgData,
    orientation = null,
    mediaSource = 'UPLOAD',
  ) => {
    try {
      const sessionId = userData?.sessionId;
      const apiName = `/content/servlet/RDESController?command=rdm.FileUpload&sessionId=${sessionId}&uploadType=7&orientation=${orientation}&mediaSource=${mediaSource}&response_format=json`;

      let formData = new FormData();
      formData.append('photo', {
        uri: imgData.path,
        type: imgData.mime,
        name: imgData.path.split('/').pop(),
      });

      console.log('formData', formData, apiName);

      const response = await postData(formData, apiName, {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        onUploadProgress: p => {
          const percent = Math.trunc((p.loaded * 100) / p.total);
          setUploadProgress(percent);
        },
      });
      console.log('drbvcsxasdfvbgresponse', response);
      // setMediaDetailId(response)
      return {
        mediaId: response?.mediaId,
      url: response?.url
      };
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const extractYoutubeId = (mediaId) => {
    // Remove 'yt_' prefix if it exists
    if (mediaId.startsWith('yt_')) {
      return mediaId.replace('yt_', '');
    }
    return mediaId;
  };

  // Handle YouTube URL
  const handleSaveYoutube = () => {
    if (youtubeUrl.trim()) {
      let videoId = '';
      const url = youtubeUrl.trim();
      
      // Handle youtu.be links (shortened URLs)
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
      } 
      // Handle regular youtube.com URLs
      else if (url.includes('youtube.com')) {
        videoId = url.split('v=')[1]?.split(/[?&]/)[0];
      } 
      // Handle direct video IDs
      else {
        videoId = url.split(/[?&]/)[0];
      }
  
      // If we couldn't extract a valid ID, show an error
      if (!videoId) {
        Alert.alert('Invalid URL', 'Please enter a valid YouTube URL');
        return;
      }
    const youtubeId = `yt_${videoId}`;
      const newMedia = {
        type: 'youtube',
        mediaId: youtubeId,
        url: youtubeUrl.trim()
      };
      const updatedMedia = [...mediaItems, newMedia];
      setMediaItems(updatedMedia);
      sendMediaToParent(updatedMedia);
      setShowYoutubeInput(false);
      setYoutubeUrl('');
    }
  };

  // Remove a media item
  const handleRemoveMedia = index => {
    const updatedMedia = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updatedMedia);
    sendMediaToParent(updatedMedia);
  };

  const sendMediaToParent = (mediaArray) => {
    const mediaIdsString = mediaArray.map(item => item.mediaId).join(',');
    onMediaSelect && onMediaSelect(mediaIdsString);
  };

  const ShowYoutubeOption =async()=>{
    const online = await checkInternet();
    if (!online) return;

    setShowYoutubeInput(!showYoutubeInput)
  }


  // Save caption for a specific image
  const handleSaveImageDetails = async () => {
    if (currentMediaIndex === null) return;

    try {
      const mediaId = mediaItems[currentMediaIndex]?.mediaId;
      if (!mediaId) return;

      const apiUrl = `/dev/h-api/update-image-caption?sessionId=${userData?.sessionId}&mediaId=${mediaId}&image_caption=${imageCaption}`;
     const res = await postData(null, apiUrl);
     console.log('resxcvbffvdcsxascdvfb',res)
     ToastAndroid.show(
                   'caption successfully added',
                   ToastAndroid.SHORT,
                 );
      setShowImageDetailModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save caption');
    }
  };

  return (
    <View style={styles.container}>
      {/* YouTube Input */}
      {showYoutubeInput && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Paste YouTube URL"
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            style={styles.input}
          />
          <Button title="Add" onPress={handleSaveYoutube} />
          <Gap m3/>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {ShowYoutubeOption() ; }}>
          <Text style={styles.buttonText}>Add YouTube</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSelectFromLibrary}
          disabled={uploading}>
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Select Images'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media Preview Grid */}
      {mediaItems.length > 0 && (
        <FlatList
          horizontal
          data={mediaItems}
          keyExtractor={(item, index) => `${item.mediaId}-${index}`}
          renderItem={({item, index}) => (
            
            <View style={styles.mediaItemContainer}>
              {item.type === 'image' ? (
                <Image source={{uri: item.url || item.uri}}  style={styles.previewImage} />
              ) : (
                <View style={styles.youtubePlaceholder}>
                  {console.log('youtubeIdyoutubeId1',item?.mediaId)}
                 <YoutubePlayer
                    height={120}
                    width={200}
                    videoId={extractYoutubeId(item?.mediaId)}
                    play={false}
                    webViewStyle={styles.youtubePlayer}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => handleRemoveMedia(index)}>
                <VectorIcon name="close" size={20} color="red" />
              </TouchableOpacity>
              {item.type === 'image' && (
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => {
                    setCurrentMediaIndex(index);
                    setImageCaption(item.caption || '');
                    setShowImageDetailModal(true);
                  }}>
                  <VectorIcon name="edit" size={20} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {/* Caption Modal */}
      <Modal visible={showImageDetailModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              margin: 10,
              width:'90%',
              height:300
            }}>
            <Text style={[FontStyle.headingSmall, {textAlign: 'center'}]}>
              Add Image Detail
            </Text>
            <Gap m4 />
            <TextInput
              placeholder="Image Caption"
              value={imageCaption}
              onChangeText={setImageCaption}
              placeholderTextColor={'black'}
              multiline
              style={styles.captionInput}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowImageDetailModal(false)}
              />
              <Button title="Save" onPress={handleSaveImageDetails} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 12,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    color: 'black',
  },
  previewContainer: {
    position: 'relative',
    marginTop: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  closeIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'white',
    borderRadius: 360,
    padding: 2,
  },
  EditICon: {
    position: 'absolute',
    left: 5,
    top: 5,
    backgroundColor: 'white',
    borderRadius: 360,
    padding: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  captionInput: {
    height: 80,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    
    marginBottom: 15,
    textAlignVertical: 'top',
    color: 'black',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  // button: {
  //   borderRadius: 10,
  //   padding: 10,
  //   elevation: 2,
  //   width: '48%',
  // },
  buttonClose: {
    backgroundColor: '#cccccc',
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  mediaItemContainer: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  youtubePlaceholder: {
    width: 200,
    height: 110,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
  },
  editIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 2,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    padding: 20,
    // margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color:'black'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default MediaSelector;
