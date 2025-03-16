import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.textContainer}>
        <Text style={styles.mainTitle}>
          استعد لاكتشاف عالم البرمجة وتطوير مهاراتك بشكل مميز!
        </Text>
        <Text style={styles.subTitle}>
          ابدأ مشروع جديد عن طريق الضفط على الزر
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: 390,
    height: 133,
    backgroundColor: '#4E7ED1',
    paddingTop: 10,
    paddingRight: 12,
    paddingBottom: 10,
    paddingLeft: 12,
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontFamily: 'LBC',
    fontSize: 20,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#FFFFFF',
    fontFamily: 'LBC',
    fontSize: 16,
    textAlign: 'right',
  },
});

export default Header; 