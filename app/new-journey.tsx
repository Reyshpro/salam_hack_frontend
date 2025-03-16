import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { storage } from './utils/storage';

const languages = [
  { label: 'C++', value: 'cpp' },
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Java', value: 'java' },
];

const environments = [
  { label: 'تطوير الويب', value: 'web' },
  { label: 'تطوير تطبيقات الموبايل', value: 'mobile' },
  { label: 'تطوير الألعاب', value: 'games' },
  { label: 'علم البيانات والذكاء الاصطناعي', value: 'ai' },
];

const goals = [
  { label: 'تعلم أساسيات البرمجة', value: 'basics' },
  { label: 'بناء مشاريع حقيقية', value: 'projects' },
  { label: 'الاستعداد للعمل', value: 'career' },
  { label: 'تطوير مهارات متقدمة', value: 'advanced' },
];

const levels = [
  { label: 'مبتدئ', value: 'مبتدئ' },
  { label: 'متوسط', value: 'متوسط' },
  { label: 'متقدم', value: 'متقدم' },
];

export default function NewJourney() {
  const [language, setLanguage] = useState('');
  const [environment, setEnvironment] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');

  const handleAddJourney = () => {
    if (!language || !environment || !goal || !level) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    
    const journeyData = {
      language,
      environment,
      goal,
      level,
      progress: 0,
      startDate: new Date().toISOString(),
    };

    // Navigate back with the new journey data
    router.replace({
      pathname: '/',
      params: { newJourney: JSON.stringify(journeyData) }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>  
        <TouchableOpacity 
          style={[styles.exitButton, { position: 'absolute', left: 10, top: 10 }]} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.exitButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>إبدأ رحلة جديدة</Text>
      <Text style={styles.subtitle}>اختر لغة البرمجة وبيئة التطوير والأهداف التي تريد تحقيقها</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر لغة البرمجة</Text>
        <RNPickerSelect
          onValueChange={(value) => setLanguage(value)}
          value={language}
          style={pickerSelectStyles}
          items={languages}
          placeholder={{ label: 'اختر لغة البرمجة', value: '' }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر بيئة التطوير</Text>
        <RNPickerSelect
          onValueChange={(value) => setEnvironment(value)}
          value={environment}
          style={pickerSelectStyles}
          items={environments}
          placeholder={{ label: 'اختر بيئة التطوير', value: '' }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر هدفك</Text>
        <RNPickerSelect
          onValueChange={(value) => setGoal(value)}
          value={goal}
          style={pickerSelectStyles}
          items={goals}
          placeholder={{ label: 'اختر هدفك', value: '' }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر مستواك</Text>
        <RNPickerSelect
          onValueChange={(value) => setLevel(value)}
          value={level}
          style={pickerSelectStyles}
          items={levels}
          placeholder={{ label: 'اختر مستواك', value: '' }}
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.button,
          (!language || !environment || !goal || !level) && styles.buttonDisabled
        ]} 
        onPress={handleAddJourney}
        disabled={!language || !environment || !goal || !level}
      >
        <Text style={styles.buttonText}>إضافة رحلة جديدة</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    maxWidth: Platform.select({ web: 600, default: undefined }),
    alignSelf: Platform.select({ web: 'center', default: undefined }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  exitButton: {
    backgroundColor: '#4E7ED1',
    padding: 10,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E7ED1',
    textAlign: 'right',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#4E7ED1',
    marginBottom: 8,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4E7ED1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4E7ED1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    color: '#333',
    textAlign: 'right',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    color: '#333',
    textAlign: 'right',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputWeb: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    color: '#333',
    textAlign: 'right',
    paddingRight: 30,
    backgroundColor: '#fff',
    width: '100%',
  },
});
