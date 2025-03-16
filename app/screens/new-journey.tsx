import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../store/useAppStore';
import { apiService } from '../services/api';

const languages = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
];

const environments = [
  { label: 'VS Code', value: 'vscode' },
  { label: 'Replit', value: 'replit' },
  { label: 'CodeSandbox', value: 'codesandbox' },
];

const levels = [
  { label: 'مبتدئ', value: 'Beginner' },
  { label: 'متوسط', value: 'Intermediate' },
  { label: 'متقدم', value: 'Advanced' },
];

export default function NewJourney() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addLanguage = useAppStore((state) => state.addLanguage);

  const handleSubmit = async () => {
    if (!selectedLanguage || !selectedEnvironment || !selectedLevel || !goal) {
      setError('الرجاء تعبئة جميع الحقول');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate environment compatibility
      const isValidEnvironment = await apiService.validateLanguageEnvironment(
        selectedLanguage,
        selectedEnvironment
      );

      if (!isValidEnvironment) {
        setError('بيئة التطوير غير متوافقة مع اللغة المختارة');
        return;
      }

      // Ensure selectedLevel is one of the expected values
      const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
      if (!validLevels.includes(selectedLevel)) {
        setError('الرجاء اختيار مستوى صحيح');
        return;
      }

      // Create initial projects structure
      const initialProjects = Array(5).fill(null).map((_, index) => ({
        id: `${selectedLanguage}-project-${index + 1}`,
        name: `مشروع ${index + 1}`,
        description: 'جاري تحميل وصف المشروع...',
        tasks: [],
        isCompleted: false,
        isLocked: index !== 0,
      }));

      const newLanguage = {
        id: `${selectedLanguage}-${Date.now()}`,
        name: selectedLanguage === 'cpp' ? 'C++' : selectedLanguage,
        environment: selectedEnvironment,
        goal,
        level: selectedLevel,
        projects: initialProjects,
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      // Add language to store
      addLanguage(newLanguage);

      // Generate first project content
      const projectContent = await apiService.generateProject({
        language: selectedLanguage,
        level: selectedLevel,
        goal,
        projectNumber: 1,
      });

      // Update project with AI-generated content
      useAppStore.getState().updateProjectContent(
        newLanguage.id,
        initialProjects[0].id,
        projectContent
      );

      router.replace('/');
    } catch (error) {
      console.error('Error creating journey:', error);
      setError('حدث خطأ أثناء إنشاء الرحلة. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-back'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>رحلة جديدة</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>اختر لغة البرمجة</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={setSelectedLanguage}
              style={styles.picker}
            >
              <Picker.Item label="اختر لغة" value="" />
              {languages.map((lang) => (
                <Picker.Item
                  key={lang.value}
                  label={lang.label}
                  value={lang.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>اختر بيئة التطوير</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedEnvironment}
              onValueChange={setSelectedEnvironment}
              style={styles.picker}
            >
              <Picker.Item label="اختر بيئة التطوير" value="" />
              {environments.map((env) => (
                <Picker.Item
                  key={env.value}
                  label={env.label}
                  value={env.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>اختر مستواك</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedLevel}
              onValueChange={setSelectedLevel}
              style={styles.picker}
            >
              <Picker.Item label="اختر المستوى" value="" />
              <Picker.Item label="مبتدئ" value="Beginner" />
              <Picker.Item label="متوسط" value="Intermediate" />
              <Picker.Item label="متقدم" value="Advanced" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>ما هو هدفك من تعلم البرمجة؟</Text>
          <TextInput
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
            placeholder="مثال: تطوير تطبيقات الويب"
            placeholderTextColor="#999"
            multiline
            textAlign="right"
            textAlignVertical="top"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء رحلة جديدة'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4E7ED1',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlign: 'right',
    color: '#333',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'right',
    marginBottom: 16,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4E7ED1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#4E7ED1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 4px rgba(78, 126, 209, 0.2)',
      },
    }),
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
