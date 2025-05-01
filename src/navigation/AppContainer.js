import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './AppNavigator'

const AppContainer = () => {
  
  return (
    <View style={{flex:1}}>
        <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
        <NavigationContainer>
            <AppNavigator />

        </NavigationContainer>
    </View>
  )
}

export default AppContainer

const styles = StyleSheet.create({})