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

const NewsCard = ({id, image, author, title, date, grid}) => {
  const formattedDate = dayjs(date).format('MMM DD, YYYY hh:mm A');
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleDotsPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <View style={[styles.card, {width: grid ? '48.5%' : '100%'}]}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} style={styles.image} />
        <View style={[styles.overlay, {width: grid ? '95%' : '97%'}]}>
          <Text style={styles.idText}>{id}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.icon}>
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
          navigation.navigate(RouteName.NEW_DETAIL_PAGE, {id: id})
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
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <VectorIcon
                name="eye-off-outline"
                size={18}
                color={Apptheme.color.black}
              />
              <Text style={styles.menuText}>Mark Private</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <VectorIcon name="flash" size={18} color={Apptheme.color.black} />
              <Text style={styles.menuText}>Show Buzz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <VectorIcon name="link" size={18} color={Apptheme.color.black} />
              <Text style={styles.menuText}>Copy URL</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
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
  },
});
