import {
  FlatList,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import VectorIcon from '../../assets/vectorIcons';
import { useNavigation } from '@react-navigation/native';
import RouteName from '../../navigation/RouteName';
import { useDispatch } from 'react-redux';
import { clearLoginData } from '../../redux/reducer/LoginSlice';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const url = 'https://support.blinkcms.ai/#login';
  const handleItemPress = (item) => {
    if (item.name === 'LogOut') {
      dispatch(clearLoginData());
      navigation.reset({
        index: 0,
        routes: [{ name: RouteName.LOGIN }],
      });
    } else if ( item.name == 'Support'){
       Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    } else if (item.navigationRoute) {
      navigation.navigate(item.navigationRoute);
    }
    
  };

  const RenderItem = ({ item }) => {
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
          style={{ marginRight: 10 }}
          size={20}
          color={Apptheme.color.primary}
        />
        <Text style={[FontStyle.labelLarge, { flex: 1 }]}>{item?.name}</Text>
        <VectorIcon
          material-icon
          name="navigate-next"
          color={Apptheme.color.primary}
        />
      </TouchableOpacity>
    );
  };

  const data = [
    {
      name: 'Promoted News',
      VectorIconName: 'newspaper',
      navigationRoute: RouteName.PROMOTED_NEWS,
    },
    {
      name: 'XHR request',
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
      navigationRoute: null, // we'll handle it manually
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
          style={[FontStyle.headingLarge, { color: Apptheme.color.background }]}>
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
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
          ItemSeparatorComponent={
            <View style={{ height: 1, backgroundColor: Apptheme.color.line }} />
          }
        />
      </ScrollView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({});
