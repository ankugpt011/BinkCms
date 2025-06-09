import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  ToastAndroid,
} from 'react-native';
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';
import useApi from '../../apiServices/UseApi';
import {
  deleteNews,
  deleteStory,
  UpdateNewsStatus,
} from '../../apiServices/apiHelper';
import {useDispatch, useSelector} from 'react-redux';
import {triggerStoryRefresh} from '../../redux/reducer/StoryUpdateSlice';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import {formatToIST} from '../atoms/formatToIST';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';

const NewsCard = ({id, image, author, title, date, grid, type, url, item}) => {
  console.log('datedatedatefvgbvfdcsx', date);
  const formattedDate = dayjs(date).format('MMM DD, YYYY hh:mm A');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {apiKey, apiEndPoint, partnerData} = useSelector(state => state.login);
  console.log('typetypetypetype', apiEndPoint,partnerData?.cmsUrl);
  

  const handleEditPress = () => {
    closeMenu();
    setWebViewVisible(true);
  };

  const closeWebView = () => {
    setWebViewVisible(false);
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const userData = useSelector(state => state.login.userData);
  console.log('userDatauserData', userData);
  const sessionId = userData?.sessionId;

  const {postData} = useApi({method: 'POST', manual: true});
  const {postData: postDeleteData} = useApi({method: 'GET', manual: true});

  const handleDotsPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleMarkPrivate = async status => {
    closeMenu();
    try {
      const sessionId = userData?.sessionId;
      const response = await postData(
        null,
        UpdateNewsStatus(id, status, sessionId),
      );

      if (response) {
        console.log('Dispatching triggerStoryRefresh with:', {
          id,
          action: status,
        });
        // Alert.alert('Success', 'News marked as private');
        dispatch(
          triggerStoryRefresh({
            id,
            action: status,
          }),
        );
      } else {
        Alert.alert('Error', 'Failed to update news status');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update news status');
    }
  };

  const handleCopyUrl = () => {
    const fullUrl = `${apiEndPoint}${url}`;
    Clipboard.setString(fullUrl);
     ToastAndroid.show('URL has been copied successfully', ToastAndroid.SHORT);
    
    closeMenu(); // Optionally close the menu
  };

  const handleDelete = async () => {
    closeMenu();
    setDeleteModal(false)

    try {
      const endpoint =
        type === 'Draft'
          ? deleteStory(sessionId, id)
          : deleteNews(sessionId, id);
      console.log('endpoint23er', endpoint);
      const response = await postDeleteData(
        null,
        endpoint,
        {method: 'GET'}, // Specify GET method here
      );
      console.log('responseresponse', response);
      if (response) {
        console.log('Story deleted successfully');

        dispatch(
          triggerStoryRefresh({
            id,
            action: 'DELETED',
          }),
        );
      } else {
        Alert.alert('Error', 'Failed to delete story');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete story');
    }
  };

  console.log('image123456', image);
  // const editUrl = `https://stagingdc.hocalwire.in//news/add-news/edit_news_applite.jsp?newsId=${id}&page=1&sessionId=${sessionId}`;
  const editUrl = `${partnerData?.cmsUrl}//news/add-news/edit_news_applite.jsp?newsId=${id}&page=1&sessionId=${sessionId}`;

  const extractYoutubeId = mediaId => {
    if (mediaId.startsWith('yt_')) {
      return mediaId.replace('yt_', '');
    }
    return mediaId;
  };

  console.log('typedfgvbhjnkmmjnbhgv', type);

  const deleteSubmissionByTempId = async tempProcessIdToDelete => {
    console.log('hello1234565432');
    try {
      const pending = await AsyncStorage.getItem('pendingSubmissions');
      const parsedPending = JSON.parse(pending) || [];

      console.log('parsedPending', parsedPending);

      // Filter out the item with the matching tempProcessId
      const updatedPending = parsedPending.filter(
        item => item.tempProcessId !== tempProcessIdToDelete,
      );

      console.log('updatedPending', updatedPending);

      // Save updated list back to AsyncStorage
      await AsyncStorage.setItem(
        'pendingSubmissions',
        JSON.stringify(updatedPending),
      );
      closeMenu();
      setDeleteModal(false)
      dispatch(
        triggerStoryRefresh({
          id,
          action: 'DELETED',
        }),
      );
      // Update your state if you're storing it in component state
      // setPendingData(updatedPending);
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const handleWebViewNavigation = navState => {
    // Check if the current URL no longer contains the newsId parameter
    console.log('navState.url', navState.url);
    const urlHasNewsId = navState.url.includes(`newsId=${id}`);

    if (!urlHasNewsId) {
      closeWebView();
      // fetchData(); // Refresh the news data
      dispatch(
        triggerStoryRefresh({
          id,
          action: 'editUpdate',
        }),
      );
    }
  };

  return (
    <View style={[styles.card, {width: grid ? '48.5%' : '100%'}]}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {image.startsWith?.('yt_') ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <YoutubePlayer
              height={'100%'}
              width={'100%'}
              videoId={extractYoutubeId(image)}
              play={false}
            />
          </View>
        ) : image ? (
          <Image
            source={{uri: image}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.image,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            <VectorIcon
              name="image-size-select-actual"
              size={20}
              color={Apptheme.color.black}
            />
          </View>
        )}
        <View style={[styles.overlay, {width: grid ? '95%' : '97%'}]}>
          <Text style={styles.idText}>{id ? id : 'Offline'}</Text>
          <View style={styles.iconRow}>
            {type == 'Draft' ? (
              userData?.can_edit_story ? (
                id ? (
                  <TouchableOpacity
                    onPress={() => {
                      type == 'Draft'
                        ? navigation.navigate(RouteName.NEW_DETAIL_PAGE, {
                            id: id,
                            type: type,
                          })
                        : handleEditPress();
                    }}
                    style={styles.icon}>
                    <VectorIcon
                      name="square-edit-outline"
                      size={14}
                      color={Apptheme.color.black}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(RouteName.NEW_DETAIL_PAGE, {
                        data: item,
                        state: 'offline',
                      });
                    }}
                    style={styles.icon}>
                    <VectorIcon
                      name="square-edit-outline"
                      size={14}
                      color={Apptheme.color.black}
                    />
                  </TouchableOpacity>
                )
              ) : null
            ) : userData?.can_edit_news ? (
              <TouchableOpacity
                onPress={() => {
                  type == 'Draft'
                    ? navigation.navigate(RouteName.NEW_DETAIL_PAGE, {
                        id: id,
                        type: type,
                      })
                    : handleEditPress();
                }}
                style={styles.icon}>
                <VectorIcon
                  name="square-edit-outline"
                  size={14}
                  color={Apptheme.color.black}
                />
              </TouchableOpacity>
            ) : null}
            {/* <TouchableOpacity style={styles.icon}>
              <VectorIcon name="eye" size={14} color={Apptheme.color.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <VectorIcon name="share" size={14} color={Apptheme.color.black} />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (id) {
            navigation.navigate(RouteName.NEW_DETAIL_PAGE, {
              id,
              type,
            });
          } else {
            navigation.navigate(RouteName.NEW_DETAIL_PAGE, {
              data: item,
              state: 'offline',
            });
          }
        }}>
        <Gap m3 />
        <Text style={[FontStyle.labelMedium, styles.author]}>{author}</Text>
        <Gap m2 />
        <Text
          style={[FontStyle.headingSmall, styles.title]}
          numberOfLines={grid ? 2 : 3}>
          {title}
        </Text>
        <Gap m2 />
      </TouchableOpacity>
      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={FontStyle.titleSmall}>{formatToIST(date)}</Text>
        <TouchableOpacity style={styles.dotsIcon} onPress={handleDotsPress}>
          <VectorIcon
            name="dots-vertical"
            size={16}
            color={Apptheme.color.black}
          />
        </TouchableOpacity>
      </View>
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={closeMenu}>
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {setDeleteModal(true);closeMenu()}}
              // onPress={() => {
              //   console.log('TouchableOpacity2345678')
              //   if (id) {
              //     console.log('idididwedfvdcsw')
              //     handleDelete();
              //   } else {
              //     console.log('elseelese')
              //     deleteSubmissionByTempId(item?.tempProcessId);
              //   }
              // }}
            >
              <VectorIcon
                name="delete"
                size={18}
                color={Apptheme.color.black}
              />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
            {console.log('SCHEDULEDSCHEDULEDSCHEDULED', type)}
            {['Draft', 'SCHEDULED'].includes(type) ? null : (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() =>
                    handleMarkPrivate(
                      type == 'Published' ? 'PRIVATE' : 'APPROVED',
                    )
                  }>
                  <VectorIcon
                    name="eye-off-outline"
                    size={18}
                    color={Apptheme.color.black}
                  />
                  <Text style={styles.menuText}>
                     {type == 'Published' ? 'Mark PRIVATE' : 'Make it LIVE'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    navigation.navigate(RouteName.SHOW_BUZZ, {newsId: id});
                    closeMenu();
                  }}>
                  <VectorIcon
                    name="flash"
                    size={18}
                    color={Apptheme.color.black}
                  />
                  <Text style={styles.menuText}>Show Buzz</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.menuItem} onPress={handleCopyUrl}>
              <VectorIcon name="link" size={18} color={Apptheme.color.black} />
              <Text style={styles.menuText}>Copy URL</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={closeWebView}>
        <View style={styles.webViewContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
            <VectorIcon name="close" size={24} color={Apptheme.color.black} />
          </TouchableOpacity>
          {console.log('editURL1234565432', editUrl)}
          <WebView
            source={{uri: editUrl}}
            style={styles.webView}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            onNavigationStateChange={handleWebViewNavigation}
            // onNavigationStateChange={navState => {
            //   // Keep track of going back navigation within component
            //  console.log('onNavigationStateChange====>', navState);
            //   }}
          />
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(false)}
        animationType="fade">
        <View style={styles.deleteModalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to Delete this News?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}
                // disabled={clearCacheLoading}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  // clearCacheLoading && {opacity: 0.7},
                ]}
                onPress={() => {
                console.log('TouchableOpacity2345678')
                if (id) {
                  console.log('idididwedfvdcsw')
                  handleDelete();
                } else {
                  console.log('elseelese')
                  deleteSubmissionByTempId(item?.tempProcessId);
                }
              }}
                // onPress={() => handleDelete()}
                // disabled={clearCacheLoading}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: {
    height: 320,
    // width: '100%',
    backgroundColor: Apptheme.color.background,
    padding: Apptheme.spacing.m3,
    // elevation: Apptheme.spacing.m3,
    borderRadius: 6,
    marginBottom: 2,
    marginTop: 10,
    // marginHorizontal:Apptheme.spacing.marginHorizontal
  },
  imageContainer: {
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Apptheme.color.imageBackground,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    // width: '95%',
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idText: {
    padding: 3,
    color: Apptheme.color.background,
    backgroundColor: Apptheme.color.black,
    borderRadius: 3,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  icon: {
    height: 20,
    aspectRatio: 1,
    borderRadius: 360,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    color: Apptheme.color.subText,
  },
  title: {
    color: Apptheme.color.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsIcon: {
    height: 20,
    aspectRatio: 1,
    backgroundColor: Apptheme.color.containerBackground,
    borderRadius: 360,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: Apptheme.color.black,
  },
  webViewContainer: {
    flex: 1,
    marginTop: 30, // Add some margin for status bar
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    padding: 5,
  },
  webView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Apptheme.color.primary,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: Apptheme.color.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  cancelButton: {
    backgroundColor: Apptheme.color.boxOutline,
  },
  confirmButton: {
    backgroundColor: Apptheme.color.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
