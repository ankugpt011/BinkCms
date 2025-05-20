import {
  FlatList,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import VectorIcon from '../../assets/vectorIcons';
import {useNavigation} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';
import {useDispatch, useSelector} from 'react-redux';
import {clearLoginData} from '../../redux/reducer/LoginSlice';
import useApi from '../../apiServices/UseApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const userData = useSelector(state => state.login.userData);
  const url = 'https://support.blinkcms.ai/#login';

  // Initialize the useApi hook for clearing cache
  const {callApi: clearCacheApi, loading: clearCacheLoading} = useApi({
    method: 'GET',
    manual: true,
    cmsUrl: false, // Assuming this is needed for your API configuration
  });

  const handleLogout = async () => {
    try {
      // Check if Google Sign-In is available
      if (GoogleSignin) {
        try {
          const isSignedIn = await GoogleSignin.isSignedIn();
          if (isSignedIn) {
            await GoogleSignin.signOut();
          }
        } catch (googleError) {
          console.log('Google sign-out error (may be normal if not signed in)', googleError);
        }
      }
      
      // Clear your app's login state
      dispatch(clearLoginData());
      
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: RouteName.LOGIN }],
      });
      
    } catch (error) {
      console.error('Logout Error:', error);
      ToastAndroid.show('Logout failed', ToastAndroid.SHORT);
    }
  };

  const handleItemPress = item => {
    if (item.name === 'LogOut') {
      // dispatch(clearLoginData());
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: RouteName.LOGIN}],
      // });
      setLogoutModal(true)
      // handleLogout()
    } else if (item.name == 'Support') {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    } else if (item.name == 'Clear Cache') {
      setShowClearCacheModal(true);
    } else if (item.navigationRoute) {
      navigation.navigate(item.navigationRoute);
    }
  };

  const handleClearCache = async () => {
    setShowClearCacheModal(false);

    try {
      // Call the clear cache API
      const response = await clearCacheApi(
        null, // No body for GET request
        '/xhr/admin/clearPartnerCache', // API endpoint
      );

      if (response) {
        ToastAndroid.show(
          
          'Cache cleared successfully',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show('Failed to clear cache', ToastAndroid.SHORT);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to clear cache');
    }
  };

  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={{
          flexDirection: 'row',
          paddingVertical: Apptheme.spacing.m5,
          alignItems: 'center',
        }}>
        <VectorIcon
          material-community-icon
          name={item?.VectorIconName}
          style={{marginRight: 10}}
          size={20}
          color={Apptheme.color.primary}
        />
        <Text style={[FontStyle.labelLarge, {flex: 1}]}>{item?.name}</Text>
        <VectorIcon
          material-icon
          name="navigate-next"
          color={Apptheme.color.primary}
        />
      </TouchableOpacity>
    );
  };

  const data = [
    ...(userData?.can_promote_news
      ? [
          {
            name: 'Promoted News',
            VectorIconName: 'newspaper',
            navigationRoute: RouteName.PROMOTED_NEWS,
          },
        ]
      : []),
    {
      name: 'Clear Cache',
      VectorIconName: 'account-arrow-left',
      navigationRoute: RouteName.XHR_REQUEST,
    },
    {
      name: 'Support',
      VectorIconName: 'headset',
      navigationRoute: '',
    },
    {
      name: 'LogOut',
      VectorIconName: 'logout',
      navigationRoute: null,
    },
  ];

  return (
    <>
      <StatusBar backgroundColor={Apptheme.color.primary} />
      <View
        style={{
          backgroundColor: Apptheme.color.primary,
          padding: Apptheme.spacing.marginHorizontal,
        }}>
        <Text
          style={[FontStyle.headingLarge, {color: Apptheme.color.background}]}>
          Profile
        </Text>
      </View>
      <ScrollView
        style={{
          backgroundColor: Apptheme.color.background,
          padding: Apptheme.spacing.marginHorizontal,
          flex: 1,
        }}>
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
          ItemSeparatorComponent={
            <View style={{height: 1, backgroundColor: Apptheme.color.line}} />
          }
        />
      </ScrollView>

      {/* Clear Cache Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showClearCacheModal}
        onRequestClose={() => setShowClearCacheModal(false)}
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Clear Cache</Text>
            <Text style={styles.modalText}>
              Are you sure you want to clear cache?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowClearCacheModal(false)}
                disabled={clearCacheLoading}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  clearCacheLoading && {opacity: 0.7},
                ]}
                onPress={handleClearCache}
                disabled={clearCacheLoading}>
                {clearCacheLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Yes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={logoutModal}
        onRequestClose={() => setLogoutModal(false)}
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setLogoutModal(false)}
                disabled={clearCacheLoading}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  clearCacheLoading && {opacity: 0.7},
                ]}
                onPress={()=>handleLogout()}
                disabled={clearCacheLoading}>
                {clearCacheLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Yes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  modalOverlay: {
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
