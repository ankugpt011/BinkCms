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
import {libraryList} from '../../apiServices/apiHelper';
import Apptheme from '../../assets/theme/Apptheme';
import DatePicker from 'react-native-date-picker';
import SearchInput from './SearchInput';

const MediaSelector = ({
  onMediaSelect,
  initialMedia,
  fieldElement,
  files,
  key,
}) => {
  const [defaultFromDate, setDefaultFromDate] = useState(() => {
    let yesterday = new Date();
    yesterday.setFullYear(yesterday.getFullYear() - 1);
    // yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [defaultToDate] = useState(new Date());
  const [mediaItems, setMediaItems] = useState([]);
  const [newmediaItems, setNewMediaItems] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [startIndex, setStartIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('news');
  const [toDate, setToDate] = useState(defaultToDate);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [filteredLibraryData, setFilteredLibraryData] = useState([]);
  const [openTo, setOpenTo] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showImageDetailModal, setShowImageDetailModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(null);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const [libraryModal, setLibraryModal] = useState(false);
  const userData = useSelector(state => state.login.userData);
  const {postData} = useApi({method: 'POST', manual: true});
  const [modalFilter, setModalFilter] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [count] = useState(20);
  const [openFrom, setOpenFrom] = useState(false);

  console.log('files2345676543', files);
  // Initialize with `initialMedia` (could be an array or single item)

  const {
    data: libraryData,
    loading: libraryLoading,
    error: libraryError,
    callApi: fetchLibrary,
  } = useApi({
    method: 'GET',
    url: '', // We'll set this dynamically when we call it
    manual: true, // We'll trigger this manually
  });

  console.log('initialMediainitialMedia', initialMedia);
  useEffect(() => {
    if (newmediaItems) {
      return;
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
      parsedMedia = initialMedia
        .split(',')
        .map(item => {
          if (!item || item === 'null') return null;

          const matchingFile = files?.find(file => file.mediaId === item);

          if (item.startsWith('yt_')) {
            return {
              type: 'youtube',
              mediaId: item,
              url: item.replace('yt_', ''),
              ...(matchingFile && {caption: matchingFile.caption}),
            };
          } else {
            return {
              type: 'image',
              mediaId: item,
              url: matchingFile ? matchingFile.url : item,
              ...(matchingFile && {
                thumbUrl: matchingFile.thumbUrl,
                caption: matchingFile.caption,
                alt: matchingFile.alt,
              }),
            };
          }
        })
        .filter(Boolean);
    }
    console.log('parsedMedia', parsedMedia);

    setMediaItems(parsedMedia);
  }, [initialMedia, files, key]);

  const fetchLibraryItems = async (loadMore = false) => {
    try {
      const sessionId = userData?.sessionId;
      if (!sessionId) {
        console.error('No session ID available');
        return;
      }

      const currentStartIndex = loadMore ? startIndex + count : 0;
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setStartIndex(0);
      }

      const apiUrl = libraryList(
        sessionId,
        fromDate.toISOString().split('T')[0],
        toDate.toISOString().split('T')[0],
        searchText,
        activeTab,
        currentStartIndex,
        count,
      );

      console.log('Calling API with URL:', apiUrl);
      const response = await fetchLibrary(null, apiUrl);
      console.log('API response:', response);

      if (response?.mediaFiles) {
        if (loadMore) {
          setFilteredLibraryData(prev => [...prev, ...response.mediaFiles]);
        } else {
          setFilteredLibraryData(response.mediaFiles);
        }
        setStartIndex(currentStartIndex);
      }
    } catch (error) {
      console.error('Error in fetchLibraryItems:', error);
      ToastAndroid.show('Failed to load library items', ToastAndroid.SHORT);
    } finally {
      setIsLoadingMore(false);
      setIsTabLoading(false);
    }
  };

  const TabData = [
    {label: 'News', value: 'news'},
    {label: 'FrequentlyUsed', value: 'frequentlyUsed'},
    {label: 'Live', value: 'live'},
    {label: 'Videos', value: 'vedios'},
    {label: 'Overlay', value: 'overlay'},
    {label: 'Icons', value: 'icons'},
  ];

  useEffect(() => {
    if (libraryModal) {
      fetchLibraryItems();
    }
  }, [libraryModal, activeTab, fromDate, toDate, searchText]);

  console.log('libraryData123456', libraryData);

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

  const handleAddFromLibrary = (item) => {
    
    const newMedia=[]

    newMedia.push({
      type: 'image',
      mediaId: item.mediaId,
      url: item.url,
      thumbUrl: item.thumbUrl,
      caption: item.caption,
      alt: item.alt
    })

    

    console.log('Adding new media:', newMedia); 
    setNewMediaItems(true);
    const updatedMedia = [...mediaItems, ...newMedia];
    setMediaItems(updatedMedia);
    sendMediaToParent(updatedMedia);
    ToastAndroid.show('Image added successfully', ToastAndroid.SHORT);
    setLibraryModal(false)
  };

  console.log('mediaItemssss', mediaItems);

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

      
      setUploading(true);
      const uploadedMedia = [];

      for (const image of Array.isArray(images) ? images : [images]) {
        const response = await uploadImage(image);
        setNewMediaItems(true);
        if (response) {
          ToastAndroid.show('Image successfully uploaded', ToastAndroid.SHORT);
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

  console.log('mediaIDssdsdss', mediaItems);

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
        url: response?.url,
      };
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const extractYoutubeId = mediaId => {
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
        url: youtubeUrl.trim(),
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

  const sendMediaToParent = mediaArray => {
    const mediaIdsString = mediaArray.map(item => item.mediaId).join(',');
    onMediaSelect && onMediaSelect(mediaIdsString);
  };

  const ShowYoutubeOption = async () => {
    const online = await checkInternet();
    if (!online) return;

    setShowYoutubeInput(!showYoutubeInput);
  };

  const showLibraryModal = async () => {
    const online = await checkInternet();
    if (!online) return;

    setLibraryModal(true);
  };

  // Save caption for a specific image
  const handleSaveImageDetails = async () => {
    if (currentMediaIndex === null) return;

    try {
      const mediaId = mediaItems[currentMediaIndex]?.mediaId;
      if (!mediaId) return;

      const apiUrl = `/dev/h-api/update-image-caption?sessionId=${userData?.sessionId}&mediaId=${mediaId}&image_caption=${imageCaption}`;
      const res = await postData(null, apiUrl);
      console.log('resxcvbffvdcsxascdvfb', res);
      ToastAndroid.show('caption successfully added', ToastAndroid.SHORT);
      setShowImageDetailModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save caption');
    }
  };
  const handleApplyFilter = () => {
    setModalFilter(false);
    fetchLibraryItems();
  };

  // Add this function to handle clear filter
  const handleClearFilter = () => {
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
    setSearchText('');
    setModalFilter(false);
    fetchLibraryItems();
  };

  const LibraryItem = ({item, index}) => {
    return (
      <View
        style={{
          padding: 10,
          borderWidth: 1,
          marginRight: 6,
          marginBottom: 10,
          borderColor: Apptheme.color.containerBackground,
        }}>
        <Image source={{uri: item?.url}} style={{height: 140, width: 145}} />
        <Gap m2 />
        <TouchableOpacity
          onPress={() => handleAddFromLibrary(item)}
          style={{
            backgroundColor: Apptheme.color.primary,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 3,
            borderRadius: 4,
          }}>
          <Text
            style={[FontStyle.titleSmall, {color: Apptheme.color.background}]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const TabItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsTabLoading(true);
          setActiveTab(item.value);
        }}
        style={{
          backgroundColor:
            activeTab === item.value
              ? Apptheme.color.primary
              : Apptheme.color.background,
          height: 25,
          borderRadius: 4,
          paddingHorizontal: 10,
          marginRight: 10,
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: Apptheme.color.primary,
        }}>
        <Text
          style={[
            FontStyle.titleSmall,
            {
              color:
                activeTab === item.value
                  ? Apptheme.color.background
                  : Apptheme.color.primary,
              lineHeight: 20,
            },
          ]}>
          {item?.label}
        </Text>
      </TouchableOpacity>
    );
  };


  console.log('mediaItems1234565432',mediaItems)


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
          <Gap m3 />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            ShowYoutubeOption();
          }}>
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
        <TouchableOpacity
          onPress={()=>showLibraryModal()}
          style={styles.button}>
          <Text style={styles.buttonText}>Library</Text>
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
              {console.log('itmghcfbjk',item)}
              {item.type === 'image' ? (
                <Image
                  source={{uri: item.url || item.uri}}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.youtubePlaceholder}>
                  {console.log('youtubeIdyoutubeId1', item?.mediaId)}
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
              width: '90%',
              height: 300,
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
      <Modal visible={libraryModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              margin: 10,
              width: '100%',
              height: '100%',
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[FontStyle.heading, {textAlign: 'center'}]}>
                Library
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                <TouchableOpacity
                  onPress={() => setModalFilter(!modalFilter)}
                  style={{
                    backgroundColor: Apptheme.color.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 4,
                    flexDirection: 'row',
                    gap: 4,
                  }}>
                  <Text
                    style={[
                      FontStyle.title,
                      {color: Apptheme.color.background},
                    ]}>
                    Filter
                  </Text>
                  {!modalFilter ? (
                    <VectorIcon
                      material-icon
                      name="keyboard-arrow-down"
                      size={16}
                      color="white"
                    />
                  ) : (
                    <VectorIcon
                      material-icon
                      name="keyboard-arrow-up"
                      size={16}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLibraryModal(false)}>
                  <VectorIcon material-community-icon name="close" size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <Gap m4 />
            {modalFilter && (
              <>
                <View
                  style={{
                    backgroundColor: Apptheme.color.subPrimary,
                    borderRadius: 6,
                    padding: 10,
                  }}>
                  <View style={styles.dateRangeContainer}>
                    <TouchableOpacity
                      onPress={() => setOpenFrom(true)}
                      style={styles.dateButton}>
                      <Text style={[FontStyle.titleSmall]}>From</Text>
                      <Text style={[FontStyle.headingSmall]}>
                        {fromDate.toLocaleDateString()}
                      </Text>
                      <VectorIcon
                        material-icon
                        name="calendar-today"
                        size={12}
                      />
                    </TouchableOpacity>

                    <Gap row m6 />

                    <TouchableOpacity
                      onPress={() => setOpenTo(true)}
                      style={styles.dateButton}>
                      <Text style={[FontStyle.titleSmall]}>To</Text>
                      <Text style={[FontStyle.headingSmall]}>
                        {toDate.toLocaleDateString()}
                      </Text>
                      <VectorIcon
                        material-icon
                        name="calendar-today"
                        size={12}
                      />
                    </TouchableOpacity>
                  </View>
                  <Gap m3 />
                  <SearchInput
                    placeholder="Search"
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="black"
                    backgroundColor={Apptheme.color.background}
                    iconColor="black"
                    textColor="black"
                  />
                  <Gap m3 />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}>
                    <TouchableOpacity
                      onPress={handleClearFilter}
                      style={{
                        flex: 1,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: Apptheme.color.primary,
                      }}>
                      <Text
                        style={[
                          FontStyle.titleSmall,
                          {color: Apptheme.color.primary},
                        ]}>
                        Clear
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleApplyFilter}
                      style={{
                        backgroundColor: Apptheme.color.primary,
                        flex: 1,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                      }}>
                      <Text
                        style={[
                          FontStyle.titleSmall,
                          {color: Apptheme.color.background},
                        ]}>
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Gap m7 />
              </>
            )}
            <FlatList
              data={TabData}
              horizontal
              contentContainerStyle={{marginBottom: 10}}
              renderItem={({item, index}) => (
                <TabItem item={item} index={index} />
              )}
            />

            <Gap m8 />
            {isTabLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={Apptheme.color.primary}
                />
              </View>
            ) : (
              <FlatList
                data={filteredLibraryData}
                keyExtractor={(item, index) => `${item.mediaId}-${index}`}
                numColumns={2}
                renderItem={({item, index}) => (
                  <LibraryItem item={item} index={index} />
                )}
                ListEmptyComponent={
                  <>
                    {isLoadingMore ? (
                      <ActivityIndicator size={'large'} />
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                          height: 500,
                        }}>
                        <Text style={FontStyle.headingSmall}>
                          No data found
                        </Text>
                      </View>
                    )}
                  </>
                }
                ListFooterComponent={
                  isLoadingMore ? (
                    <ActivityIndicator
                      size="small"
                      color={Apptheme.color.primary}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => fetchLibraryItems(true)}
                      style={{
                        backgroundColor: Apptheme.color.primary,
                        paddingVertical: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                      }}>
                      <Text
                        style={[
                          FontStyle.labelMedium,
                          {color: Apptheme.color.background},
                        ]}>
                        Load More
                      </Text>
                    </TouchableOpacity>
                  )
                }
              />
            )}
          </View>
        </View>
        <DatePicker
          modal
          open={openFrom}
          date={fromDate}
          mode="date"
          onConfirm={date => {
            setOpenFrom(false);
            setFromDate(date);
          }}
          onCancel={() => setOpenFrom(false)}
        />
        <DatePicker
          modal
          open={openTo}
          date={toDate}
          mode="date"
          onConfirm={date => {
            setOpenTo(false);
            setToDate(date);
          }}
          onCancel={() => setOpenTo(false)}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 5,
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
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateRangeContainer: {
    flexDirection: 'row',
  },
  dateButton: {
    flex: 1,
    backgroundColor: Apptheme.color.background,
    borderRadius: 6,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default MediaSelector;
