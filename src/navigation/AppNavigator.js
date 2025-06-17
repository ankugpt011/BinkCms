import { StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation';
import RouteName from './RouteName';
import Login from '../screens/Login';
import PromotedNews from '../screens/promotedNews';
import XHRRequest from '../screens/XHRRequest';
import {useSelector} from 'react-redux';
import NewDetailPage from '../screens/viewStory/NewDetailPage';
import ShowBuzz from '../screens/showBUzz';
import EditBuzz from '../screens/showBUzz/EditBuzz';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const userData = useSelector(state => state.login.userData);
  const isLoggedIn = !!userData?.sessionId;
  return (
    // <SafeAreaView style={{flex:1}} bac>
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
      <Stack.Screen name={RouteName.SHOW_BUZZ} component={ShowBuzz} />
      <Stack.Screen name={RouteName.EDIT_BUZZ} component={EditBuzz} />

    </Stack.Navigator>
    // </SafeAreaView>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
