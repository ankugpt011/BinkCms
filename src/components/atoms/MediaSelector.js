import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import VectorIcon from '../../assets/vectorIcons';

const MediaSelector = ({ onMediaSelect }) => {
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectFromLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      setSelectedImage(image.path);
      setShowYoutubeInput(false);

      onMediaSelect && onMediaSelect({
        type: 'image',
        uri: image.path,
        mime: image.mime,
        width: image.width,
        height: image.height,
      });

    } catch (error) {
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
      onMediaSelect && onMediaSelect({ type: 'youtube', url: youtubeUrl.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleAddYoutube}>
          <Text style={styles.buttonText}>Add Youtube</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSelectFromLibrary}>
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

      {selectedImage && (
        <>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        <TouchableOpacity onPress={()=>setSelectedImage(null)} style={{position:'absolute',right:5,top:62,backgroundColor:'white',borderRadius:360,padding:2}}>
            <VectorIcon material-icon name='close' size={20} color='red'/>
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
});

export default MediaSelector;
