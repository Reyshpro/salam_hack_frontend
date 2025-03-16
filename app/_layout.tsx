import { Stack } from 'expo-router';
import { Platform, ViewStyle, StatusBar, SafeAreaView } from 'react-native';

const containerStyle: ViewStyle = {
  flex: 1,
  backgroundColor: '#fff',
  ...Platform.select({
    android: {
      paddingTop: StatusBar.currentHeight,
    },
    ios: {
      paddingTop: 0,
    },
    default: {
      paddingTop: 0,
    }
  }),
};

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4E7ED1' }}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} 
        backgroundColor="#4E7ED1" 
      />
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: containerStyle,
          animation: Platform.select({
            ios: 'default',
            android: 'fade',
            default: 'none'
          }),
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaView>
  );
}
