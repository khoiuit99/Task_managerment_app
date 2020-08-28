import React, { Component } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import firebaseApp from './components/firebaseConfig';
import HomeStack from './screens/HomeStack/HomeStackMain';


export default function App() {
  
  firebaseApp

  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  )
}

