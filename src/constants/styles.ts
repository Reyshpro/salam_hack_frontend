import { I18nManager, StyleSheet } from 'react-native';

// Force RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
}); 