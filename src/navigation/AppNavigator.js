import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation';
import RouteName from './RouteName';
import Login from '../screens/Login';
import PromotedNews from '../screens/promotedNews';
import XHRRequest from '../screens/XHRRequest';
import {useSelector} from 'react-redux';
import NewDetailPage from '../screens/viewStory/NewDetailPage';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const userData = useSelector(state => state.login.userData);
  const isLoggedIn = !!userData?.sessionId;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationTypeForReplace: 'push',
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      initialRouteName={isLoggedIn ? RouteName.BOTTOM_TAB : RouteName.LOGIN}>
      <Stack.Screen
        name={RouteName.LOGIN}
         component={Login}
      ></Stack.Screen>
      <Stack.Screen
        name={RouteName.BOTTOM_TAB}
        component={BottomTabNavigation}
      />
      <Stack.Screen name={RouteName.PROMOTED_NEWS} component={PromotedNews} />
      <Stack.Screen name={RouteName.XHR_REQUEST} component={XHRRequest} />
      <Stack.Screen name={RouteName.NEW_DETAIL_PAGE} component={NewDetailPage} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
