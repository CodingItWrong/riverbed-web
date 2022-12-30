// SafeAreaView fails without React import in CLI for some reason
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {SafeAreaView, StatusBar, Text} from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>Hello, React Native!</Text>
      </SafeAreaView>
    </>
  );
}