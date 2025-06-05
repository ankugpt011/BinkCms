import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import CustomTextInput from '../../components/atoms/CustomTextInput';
import Gap from '../../components/atoms/Gap';
import FontStyle from '../../assets/theme/FontStyle';
import {useNavigation} from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import DropDownPicker from 'react-native-dropdown-picker';
import VectorIcon from '../../assets/vectorIcons';
import useApi from '../../apiServices/UseApi';
import {useDispatch, useSelector} from 'react-redux';
import {setLoginData, setPartnerData} from '../../redux/reducer/LoginSlice';
import {
  api_google_register,
  LoginApi,
  PartnerCodeApi,
} from '../../apiServices/apiHelper';
import DeviceInfo from 'react-native-device-info';
import Images from '../../assets/images';

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [partnersCode, setPartnersCode] = useState('');
  const {partnerData} = useSelector(state => state.login);
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerDetail, setPartnerDetail] = useState();
  const [logLoading,setLogLoading]=useState(false)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {data, loading, error, callApi} = useApi({
    method: 'GET',
    url: '',
    // HDUMMY17
  });

  const {callApi: googleLogin} = useApi({
    method: 'GET',
    url: '',
    // HDUMMY17
  });

  const {
    data: loginData,
    error: loginError,
    loading: loginLoading,
    callApi: callLoginApi,
  } = useApi({
    method: 'POST', // Stay as POST
    url: '',
    manual: true,
  });

  const PartnerConfirm = async () => {
    console.log('hello', partnersCode.trim());
    if (partnersCode.trim() === '') {
      ToastAndroid.show('Please enter a partner code', ToastAndroid.SHORT);
      return;
    }

    if (partnerSuccess) {
      ToastAndroid.show('Partner already confirmed', ToastAndroid.SHORT);
      return;
    }

    try {
      const partnerRes = await callApi(null, PartnerCodeApi(partnersCode));
      console.log('partnerRes', partnerRes);

      if (partnerRes && !partnerRes.errorMessage) {
        dispatch(setPartnerData(partnerRes));
        setPartnerDetail(partnerRes);
        setPartnerSuccess(true);
        ToastAndroid.show(
          'Partner code verified successfully',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show('Invalid Partner Code', ToastAndroid.SHORT);
        setPartnerSuccess(false);
      }
    } catch (err) {
      console.error('Partner confirmation error:', err);
      ToastAndroid.show(
        err?.message || 'Failed to verify partner code',
        ToastAndroid.SHORT,
      );
      setPartnerSuccess(false);
    }
  };

  const handleLogin = async () => {

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (trimmedEmail === '') {
      ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
      return;
    }
  
    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      ToastAndroid.show('Please enter a valid email address', ToastAndroid.SHORT);
      return;
    }
  
    // Check for uppercase email (optional)
    if (trimmedEmail !== trimmedEmail.toLowerCase()) {
      ToastAndroid.show('Email should be in lowercase', ToastAndroid.SHORT);
      return;
    }
  
    if (trimmedPassword === '') {
      ToastAndroid.show('Please enter your Password', ToastAndroid.SHORT);
      return;
    }

    try {

      setLogLoading(true)

      const loginUrl = LoginApi(
        partnerData.app,
        partnerData.partner,
        email,
        password,
        'login',
        undefined,
      );

      console.log('POST URL with query params:', loginUrl);

      const response = await callLoginApi(null, loginUrl);

      console.log('responsefghbjnkmjhg', response);

      if (response?.error) {
        ToastAndroid.show(
          response.errorMessage || 'Login failed',
          ToastAndroid.SHORT,
        );
        return;
      }

      if (response) {
        dispatch(setLoginData(response));
        navigation.reset({
          index: 0,
          routes: [{name: RouteName.BOTTOM_TAB}],
        });
        setLogLoading(false)
      } else {
        ToastAndroid.show('Invalid Detail', ToastAndroid.SHORT);
        setLogLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err);
    }finally{
      setLogLoading(false)
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:'1058846645245-614h8fha6st3qds0mgqmv1cadct9j83v.apps.googleusercontent.com'
        // '1058846645245-614h8fha6st3qds0mgqmv1cadct9j83v.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleLogin = async () => {
    if (!partnerSuccess || !partnerData?.app || !partnerData?.partner) {
      ToastAndroid.show(
        'Please confirm your partner code first',
        ToastAndroid.SHORT,
      );
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google User Info:', userInfo?.data?.user?.givenName);

      // Construct login URL using your existing helper

      let params = {
        name:
          userInfo?.data?.user?.givenName + userInfo?.data?.user?.familyName,
        email: userInfo?.data?.user?.email,
        first_name: userInfo?.data?.user?.givenName,
        last_name: userInfo?.data?.user?.familyName,
        id: userInfo?.data?.user?.id,
        image: userInfo?.data?.user?.photo,
        deviceId: DeviceInfo?.getUniqueId(),
        type: 'google',
      };

      const response = await googleLogin(
        null,
        LoginApi(
          partnerData.app,
          partnerData.partner,
          params.email,
          'sdw4we3r34fesfsdgdgfd',
          'login',
          params.id,
        ),
      );
      console.log('response12345', response);
      if (response?.error) {
        ToastAndroid.show(
           'Email Id  not registered',
          ToastAndroid.SHORT,
        );
        return;
      }

      if (response) {
        dispatch(setLoginData(response));
        navigation.reset({
          index: 0,
          routes: [{name: RouteName.BOTTOM_TAB}],
        });
      } else {
        ToastAndroid.show('Login failed', ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled login');
      } else {
        console.error('Google Sign-In Error:', error);
      }
    }
  };

  const onChangePartnerCode = code => {
    setPartnersCode(code);
    console.log('partnerSuccess', partnerSuccess);
    // if (partnerSuccess) {
    // Reset state when user changes the partner code after confirmation
    dispatch(setPartnerData(null));
    setPartnerSuccess(false);
    // }
  };

  return (
    <>
      <StatusBar backgroundColor={Apptheme.color.primary} />
      <ImageBackground
        source={Images.pngImages.loginLogo}
        style={styles.imageBackground}
        resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.box}>
            <View>
              {partnerSuccess && (
                <TouchableOpacity
                  style={{position: 'absolute', zIndex: 10000}}
                  onPress={() => onChangePartnerCode()}>
                  <VectorIcon material-icon name="arrow-back-ios" size={20} />
                </TouchableOpacity>
              )}
              <Text
                style={[
                  FontStyle.headingLarge,
                  {
                    color: Apptheme.color.primary,
                    marginBottom: 10,
                    textAlign: 'center',
                  },
                ]}>
                {partnerSuccess ? 'Welcome !!' : 'Enter Your Partner ID'}
              </Text>
            </View>

            {partnerSuccess ? (
              <Text style={[FontStyle.heading, {textAlign: 'center'}]}>
                {partnerDetail?.displayName}
              </Text>
            ) : (
              <CustomTextInput
                value={partnersCode}
                // value={partnersCode}
                onChangeText={onChangePartnerCode}
                placeholder="Partners Code"
                RightButton={true}
                onRightButtonPress={() => PartnerConfirm()}
                rightButtonText={partnerSuccess ? 'Confirmed' : 'Confirm'}
              />
            )}
            {partnerSuccess && (
              <>
                <Gap m8 />

                <CustomTextInput
                  value={email}
                  onChangeText={e => setEmail(e)}
                  placeholder="Enter Email"
                  leftIconName="email-outline"
                  rightIconName="close-circle"
                  onRightIconPress={() => setEmail('')}
                />
                <Gap m6 />
                <CustomTextInput
                  value={password}
                  onChangeText={e => setPassword(e)}
                  placeholder="Enter Password"
                  secureTextEntry={true}
                  leftIconName="lock-outline"
                  showTogglePassword={true}
                />
                <Gap m6 />

                <TouchableOpacity
                  // onPress={() => navigation.navigate(RouteName.BOTTOM_TAB)}
                  onPress={() => {logLoading?'':handleLogin()}}
                  style={styles.loginButton}>
                  <Text
                    style={[
                      FontStyle.labelMedium,
                      {color: Apptheme.color.background},
                    ]}>
                    {logLoading?'loading...' :'Login'}
                  </Text>
                </TouchableOpacity>

                <Gap m6 />
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  style={styles.googleButton}>
                  {/* <VectorIcon
                  material-community-icon
                  name="google"
                  color={Apptheme.color.black}
                  size={18}
                  style={{marginRight: 10}}
                /> */}
                  <Image
                    source={Images.pngImages.googleImage}
                    style={{marginRight: 10}}
                    height={18}
                    width={18}
                  />
                  <Text style={[FontStyle.labelMedium, {color: 'black'}]}>
                    Login with Google
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  box: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    zIndex: 10,
  },
  loginButton: {
    backgroundColor: Apptheme.color.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  googleButton: {
    backgroundColor: Apptheme.color.subPrimary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    marginTop: 4,
    zIndex: 1000,
  },
});
