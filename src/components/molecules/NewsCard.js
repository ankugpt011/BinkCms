import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';
import useApi from '../../apiServices/UseApi';
import { UpdateNewsStatus } from '../../apiServices/apiHelper';
import { useDispatch, useSelector } from 'react-redux';
import { triggerStoryRefresh } from '../../redux/reducer/StoryUpdateSlice';
import WebView from 'react-native-webview';


const NewsCard = ({id, image, author, title, date, grid, type,}) => {
  const formattedDate = dayjs(date).format('MMM DD, YYYY hh:mm A');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [webViewVisible, setWebViewVisible] = useState(false);
  
  

  const handleEditPress = () => {
    closeMenu();
    setWebViewVisible(true);
  };

  const closeWebView = () => {
    setWebViewVisible(false);
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const userData = useSelector(state => state.login.userData);
  const sessionId = userData?.sessionId;

  const { postData } = useApi({ method: 'POST', manual: true });

  const handleDotsPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };


  const handleMarkPrivate = async (status) => {
    closeMenu();
    try {
      const sessionId = userData?.sessionId
      const response = await postData(null, UpdateNewsStatus(id,status,sessionId));
      
      if (response) {
        console.log('response12345t',response)
        Alert.alert('Success', 'News marked as private');
        dispatch(triggerStoryRefresh({
          id,
          action: status
        }));
        
      } else {
        Alert.alert('Error', 'Failed to update news status');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update news status');
    }
  };

  console.log('image123456', image);
  const editUrl = `https://stagingdc.hocalwire.in//news/add-news/edit_news_applite.jsp?newsId=${id}&page=1&sessionId=${sessionId}`;


 
  return (
    <View style={[styles.card, {width: grid ? '48.5%' : '100%'}]}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} style={styles.image} />
        <View style={[styles.overlay, {width: grid ? '95%' : '97%'}]}>
          <Text style={styles.idText}>{id}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={handleEditPress} style={styles.icon}>
              <VectorIcon
                name="square-edit-outline"
                size={14}
                color={Apptheme.color.black}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <VectorIcon name="eye" size={14} color={Apptheme.color.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <VectorIcon name="share" size={14} color={Apptheme.color.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(RouteName.NEW_DETAIL_PAGE, {id: id, type: type})
        }>
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
        <Text style={FontStyle.titleSmall}>{formattedDate}</Text>
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
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <VectorIcon
                name="delete"
                size={18}
                color={Apptheme.color.black}
              />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
            {type == 'Draft'?null:
            <>
              <TouchableOpacity style={styles.menuItem}  onPress={()=>handleMarkPrivate(type == 'Published'?'PRIVATE':'APPROVED')}>
                <VectorIcon
                  name="eye-off-outline"
                  size={18}
                  color={Apptheme.color.black}
                />
                <Text style={styles.menuText}>Mark {type == 'Published'?'PRIVATE':'APPROVED'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
                <VectorIcon
                  name="flash"
                  size={18}
                  color={Apptheme.color.black}
                />
                <Text style={styles.menuText}>Show Buzz</Text>
              </TouchableOpacity>
            </>}
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
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
          {console.log('editURL',editUrl)}
          <WebView 
            source={{ uri: editUrl }}
            style={styles.webView}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
          />
        </View>
      </Modal>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: {
    height: 270,
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
    height: 150,
    borderRadius: 4,
    overflow: 'hidden',
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
    width: 200,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: Apptheme.color.black,
  }, webViewContainer: {
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
});
