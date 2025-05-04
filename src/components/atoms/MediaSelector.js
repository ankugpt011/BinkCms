import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import VectorIcon from '../../assets/vectorIcons';

import useApi from '../../apiServices/UseApi';
import { useSelector } from 'react-redux';


const MediaSelector = ({ onMediaSelect, initialMedia, fieldElement }) => {

  console.log('initialMedia',initialMedia,fieldElement)

  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(initialMedia || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const userData = useSelector(state => state.login.userData);



  useEffect(()=>{
    setSelectedImage(initialMedia)
  },[initialMedia])


  const { postData } = useApi({ method: 'POST', manual: true });

  const handleSelectFromLibrary = async () => {
    console.log('test1')
    try {
    console.log('test2')
      
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      setSelectedImage(image.path);
      setShowYoutubeInput(false);

      setUploading(true);
    console.log('test3')

      console.log('image njkml,',image)
      const response = await uploadImage(image);
      console.log('responsewe',response)

      if (response) {
        onMediaSelect &&
          onMediaSelect({
            type: 'image',
            uri: image.path,
            mediaId: response,
            mime: image.mime,
          });
      } else {
        Alert.alert('Upload Failed', 'Please try again later.');
      }

      setUploading(false);
    } catch (error) {
      setUploading(false);
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.warn('Image selection error:', error);
      }
    }
  };

  

  const handleAddYoutube = () => {
    setShowYoutubeInput(!showYoutubeInput);
    setSelectedImage(null);
  };

  const handleSaveYoutube = () => {
    if (youtubeUrl.trim()) {
      onMediaSelect && onMediaSelect({ type: 'youtube', mediaId: youtubeUrl.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleAddYoutube}>
          <Text style={styles.buttonText}>Add Youtube</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=>{handleSelectFromLibrary();console.log('heloocvgbhjnkmnjbhvg')}}>
          <Text style={styles.buttonText}>Select From Library</Text>
        </TouchableOpacity>
      </View>

      {showYoutubeInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Paste YouTube URL"
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
          />
          <Button title="Save" onPress={handleSaveYoutube} />
        </View>
      )}

      {uploading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.progressText}>{uploadProgress}%</Text>
        </View>
      )}

      {selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity
             onPress={() => {
              setSelectedImage(null);
              onMediaSelect && onMediaSelect(null);
            }}
            style={styles.closeIcon}>
            <VectorIcon material-icon name="close" size={20} color="red" />
          </TouchableOpacity>
        </>
      )}
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
  previewImage: {
    marginTop: 16,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  closeIcon: {
    position: 'absolute',
    right: 5,
    top: 62,
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
  progressText: {
    fontSize: 12,
    color: 'black',
  },
});

export default MediaSelector;
