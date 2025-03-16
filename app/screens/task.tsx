import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../store/useAppStore';
import { apiService } from '../services/api';

export default function Task() {
  const { languageId, projectId, taskId } = useLocalSearchParams();
  const [solution, setSolution] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const language = useAppStore((state) =>
    state.languages.find((l) => l.id === languageId)
  );
  const project = language?.projects.find((p) => p.id === projectId);
  const task = project?.tasks.find((t) => t.id === taskId);
  const nextProject = language?.projects.find(p => !p.isCompleted && p.id !== projectId);

  const completeTask = useAppStore((state) => state.completeTask);
  const completeProject = useAppStore((state) => state.completeProject);

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;

  const handleSubmit = async () => {
    if (!solution.trim()) {
      Alert.alert('تنبيه', 'الرجاء إدخال الحل قبل التقديم');
      return;
    }

    setIsSubmitting(true);

    try {
      const { isValid, feedback } = await apiService.validateTaskCompletion(
        language?.name || '',
        projectId as string,
        taskId as string,
        solution
      );

      if (isValid) {
        completeTask(
          languageId as string,
          projectId as string,
          taskId as string
        );

        const allTasksCompleted = project?.tasks.every(
          (t) => t.isCompleted || t.id === taskId
        );

        if (allTasksCompleted) {
          completeProject(languageId as string, projectId as string);
          
          // If there's a next project, navigate to it
          if (nextProject) {
            router.replace({
              pathname: "/screens/project",
              params: { 
                languageId, 
                projectId: nextProject.id,
                autoStart: 'true' // Indicate this is an automatic navigation
              }
            });
          } else {
            Alert.alert(
              'تهانينا!',
              'لقد أكملت جميع المشاريع في هذه اللغة!',
              [
                {
                  text: 'العودة للصفحة الرئيسية',
                  onPress: () => router.push('/'),
                },
              ]
            );
          }
        } else {
          const nextTask = project?.tasks.find(
            (t) => !t.isCompleted && t.id !== taskId
          );
          
          if (nextTask) {
            router.replace({
              pathname: "/screens/task",
              params: {
                languageId,
                projectId,
                taskId: nextTask.id,
              },
            });
          }
        }
      } else {
        Alert.alert(
          'حاول مرة أخرى',
          feedback || 'الحل غير صحيح. راجع التعليمات وحاول مرة أخرى.'
        );
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      Alert.alert(
        'خطأ',
        'حدث خطأ أثناء التحقق من الحل. الرجاء المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task || !language || !project) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04 }]}>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/screens/project',
            params: { languageId, projectId }
          })}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-back'}
            size={isSmallScreen ? 20 : 24}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isSmallScreen && styles.smallHeaderTitle]}>
          {task.title}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.largeScreenContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{language.level}</Text>
          </View>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        {task?.requirements && (
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>المتطلبات:</Text>
            {task.requirements.map((req, index) => (
              <Text key={index} style={styles.requirementItem}>• {req}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelp(!showHelp)}
        >
          <Text style={styles.helpButtonText}>
            {showHelp ? 'إخفاء المساعدة' : 'طلب مساعدة'}
          </Text>
        </TouchableOpacity>

        {showHelp && task?.aiHelp && (
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>{task.aiHelp}</Text>
            {task.hints && task.hints.map((hint, index) => (
              <Text key={index} style={styles.hintText}>💡 {hint}</Text>
            ))}
          </View>
        )}

        <View style={styles.solutionContainer}>
          <Text style={styles.solutionLabel}>الحل:</Text>
          <TextInput
            style={styles.solutionInput}
            multiline
            value={solution}
            onChangeText={setSolution}
            placeholder="اكتب الحل هنا..."
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'جاري التحقق...' : 'تحقق من الحل'}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  smallHeaderTitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  largeScreenContent: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  taskInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 8,
  },
  projectTitle: {
    fontSize: Platform.select({
      ios: 28,
      android: 24,
      default: 28,
    }),
    fontWeight: 'bold',
    color: '#4E7ED1',
    flex: 1,
    textAlign: 'right',
  },
  levelBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 12,
  },
  levelText: {
    color: '#666',
    fontSize: Platform.select({
      ios: 14,
      android: 13,
      default: 14,
    }),
  },
  description: {
    fontSize: Platform.select({
      ios: 16,
      android: 15,
      default: 16,
    }),
    color: '#333',
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 24,
  },
  helpButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  helpButtonText: {
    color: '#4E7ED1',
    fontSize: Platform.select({
      ios: 16,
      android: 15,
      default: 16,
    }),
    marginRight: 8,
    fontWeight: '600',
  },
  helpContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    marginHorizontal: 4,
  },
  helpText: {
    fontSize: Platform.select({
      ios: 14,
      android: 13,
      default: 14,
    }),
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'right',
  },
  hintText: {
    fontSize: Platform.select({
      ios: 14,
      android: 13,
      default: 14,
    }),
    color: '#666',
    marginBottom: 8,
    textAlign: 'right',
  },
  requirementsContainer: {
    marginBottom: 24,
    marginHorizontal: 4,
  },
  requirementsTitle: {
    fontSize: Platform.select({
      ios: 16,
      android: 15,
      default: 16,
    }),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  requirementItem: {
    fontSize: Platform.select({
      ios: 14,
      android: 13,
      default: 14,
    }),
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  solutionContainer: {
    marginBottom: 24,
    marginHorizontal: 4,
  },
  solutionLabel: {
    fontSize: Platform.select({
      ios: 16,
      android: 15,
      default: 16,
    }),
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
    fontWeight: '600',
  },
  solutionInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: Platform.select({
      ios: 16,
      android: 15,
      default: 16,
    }),
    minHeight: 150,
    textAlign: 'right',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4E7ED1',
    borderRadius: 8,
    padding: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
    alignItems: 'center',
    marginHorizontal: 4,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Platform.select({
      ios: 16,
      android: 15,
      default: 16,
    }),
    fontWeight: 'bold',
  },
});
