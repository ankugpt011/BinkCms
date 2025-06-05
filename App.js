import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppContainer from './src/navigation/AppContainer';
import {Provider} from 'react-redux';

import {PersistGate} from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/Store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Apptheme from './src/assets/theme/Apptheme';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1,backgroundColor:'rgb(119,75,228)'}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
      </GestureHandlerRootView>
      </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
