import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import Header from './components/Header';
import { globalStyles } from './constants/styles';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'LBC': require('./assets/fonts/LBC.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading component
  }

  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
}); 