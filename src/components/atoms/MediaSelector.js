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
  console.log('initialMedia', initialMedia, fieldElement);

  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(initialMedia || null);
  const [uploading, setUploading] = useState(false);
  const userData = useSelector(state => state.login.userData);
  console.log('userData1234',userData)
  const { postData } = useApi({ method: 'POST', manual: true });

  useEffect(() => {
    setSelectedImage(initialMedia);
  }, [initialMedia]);

  const handleSelectFromLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      console.log('Selected image:', image);
      setSelectedImage(image.path);
      setShowYoutubeInput(false);
      setUploading(true);

      // Simulate upload (replace with actual upload logic)
      const response = await uploadImage(image);
      console.log('Upload response:', response);

      if (response) {
        const mediaData = {
          type: 'image',
          uri: image.path,
          mediaId: response,
          mime: image.mime,
          fieldElement // Pass the field element for identification
        };
        console.log('Calling onMediaSelect with:', mediaData);
        onMediaSelect && onMediaSelect(mediaData);
      } else {
        Alert.alert('Upload Failed', 'Please try again later.');
      }
    } catch (error) {
      console.log('Image selection error:', error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to select image');
      }
    } finally {
      setUploading(false);
    }
  };

  // Mock upload function - replace with your actual upload logic
  // const uploadImage = async (image) => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(`uploaded_${Date.now()}`);
  //     }, 1500);
  //   });
  // };
  const uploadImage = async (imgData, orientation = null, mediaSource = 'UPLOAD') => {
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

  const handleAddYoutube = () => {
    setShowYoutubeInput(!showYoutubeInput);
    setSelectedImage(null);
  };

  const handleSaveYoutube = () => {
    if (youtubeUrl.trim()) {
      const mediaData = {
        type: 'youtube',
        mediaId: youtubeUrl.trim(),
        fieldElement // Pass the field element for identification
      };
      console.log('Calling onMediaSelect with YouTube:', mediaData);
      onMediaSelect && onMediaSelect(mediaData);
      setShowYoutubeInput(false);
    }
  };

  const handleRemoveMedia = () => {
    console.log('Removing media for field:', fieldElement);
    setSelectedImage(null);
    onMediaSelect && onMediaSelect(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleAddYoutube}>
          <Text style={styles.buttonText}>Add Youtube</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSelectFromLibrary}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Select From Library'}
          </Text>
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
        </View>
      )}

      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={handleRemoveMedia}
            style={styles.closeIcon}
          >
            <VectorIcon material-icon name="close" size={20} color="red" />
          </TouchableOpacity>
        </View>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
});

export default MediaSelector;