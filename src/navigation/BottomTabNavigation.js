
import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RouteName from './RouteName';
import Profile from '../screens/profile';
import Home from '../screens/home';
import CreateStory from '../screens/createStory';
import ViewStory from '../screens/viewStory';
import Images from '../assets/images';
import Apptheme from '../assets/theme/Apptheme';

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 3,
        },
        tabBarIconStyle: {
          // marginTop: 3,
        },
        tabBarActiveTintColor: Apptheme.color.primary,
        tabBarInactiveTintColor: 'gray',
        // unmountOnBlur: true,
      }}>
      <Tab.Screen
        name={RouteName.HOME_SCREEN}
        component={Home}
        options={{
            tabBarIcon: tab => (
              <Image
                source={Images.pngImages.home}
                style={styles.imageStyle}
                tintColor={
                  tab.focused ? Apptheme.color.primary : Apptheme.color.subText
                }
              />
            ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={RouteName.CREATE_STORY}
        component={CreateStory}
        options={{
            tabBarIcon: tab => (
              <Image
                source={Images.pngImages.createStory}
                style={styles.imageStyle}
                tintColor={
                  tab.focused ? Apptheme.color.primary : Apptheme.color.subText
                }
              />
            ),
          tabBarLabel: 'CreateStory',
        }}
      />
      <Tab.Screen
        name={RouteName.VIEW_STORY}
        component={ViewStory}
        options={{
            tabBarIcon: tab => (
              <Image
                source={Images.pngImages.viewStory}
                style={{height: 23, width: 23, resizeMode: 'contain'}}
                tintColor={
                  tab.focused ? Apptheme.color.primary : Apptheme.color.subText
                }
              />
            ),
          tabBarLabel: 'ViewStory',
        }}
      />
      <Tab.Screen
        name={RouteName.PROFILE_SCREEN}
        component={Profile}
        options={{
            tabBarIcon: tab => (
              <Image
                source={Images.pngImages.profile}
                style={styles.imageStyle}
                tintColor={
                  tab.focused ? Apptheme.color.primary : Apptheme.color.subText
                }
              />
            ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
  imageStyle: {height: 23, width: 23, resizeMode: 'contain'},
});
