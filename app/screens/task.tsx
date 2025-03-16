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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../store/useAppStore';
import { apiService } from '../services/api';

export default function Task() {
  const { languageId, projectId, taskId } = useLocalSearchParams();
  const [solution, setSolution] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const language = useAppStore((state) =>
    state.languages.find((l) => l.id === languageId)
  );
  const project = language?.projects.find((p) => p.id === projectId);
  const task = project?.tasks.find((t) => t.id === taskId);

  const completeTask = useAppStore((state) => state.completeTask);
  const completeProject = useAppStore((state) => state.completeProject);

  useEffect(() => {
    if (!task || !language || !project) {
      router.replace('/');
      return;
    }

    loadHints();
  }, [task, language, project]);

  const loadHints = async () => {
    try {
      const taskHints = await apiService.getProjectHints(
        language?.name || '',
        projectId as string,
        taskId as string
      );
      setHints(taskHints);
    } catch (error) {
      console.error('Error loading hints:', error);
    }
  };

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

        // Check if all tasks in the project are completed
        const allTasksCompleted = project?.tasks.every(
          (t) => t.isCompleted || t.id === taskId
        );

        if (allTasksCompleted) {
          completeProject(languageId as string, projectId as string);
          Alert.alert(
            'تهانينا!',
            'لقد أكملت جميع مهام هذا المشروع. يمكنك الآن الانتقال إلى المشروع التالي.',
            [
              {
                text: 'حسناً',
                onPress: () => router.replace('/project'),
              },
            ]
          );
        } else {
          Alert.alert('أحسنت!', feedback, [
            {
              text: 'المهمة التالية',
              onPress: () => {
                const nextTask = project?.tasks.find(
                  (t) => !t.isCompleted && t.id !== taskId
                );
                if (nextTask) {
                  router.replace({
                    pathname: '/task',
                    params: {
                      languageId,
                      projectId,
                      taskId: nextTask.id,
                    },
                  });
                }
              },
            },
          ]);
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
        <Text style={styles.headerTitle}>{task.title}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{language.level}</Text>
          </View>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        <TouchableOpacity
          style={styles.hintsButton}
          onPress={() => setShowHints(!showHints)}
        >
          <MaterialIcons
            name={showHints ? 'lightbulb' : 'lightbulb-outline'}
            size={24}
            color="#4E7ED1"
          />
          <Text style={styles.hintsButtonText}>
            {showHints ? 'إخفاء التلميحات' : 'عرض التلميحات'}
          </Text>
        </TouchableOpacity>

        {showHints && (
          <View style={styles.hintsContainer}>
            {hints.map((hint, index) => (
              <View key={index} style={styles.hintItem}>
                <MaterialIcons name="tips-and-updates" size={20} color="#4E7ED1" />
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.solutionContainer}>
          <Text style={styles.solutionLabel}>الحل:</Text>
          <TextInput
            style={styles.solutionInput}
            value={solution}
            onChangeText={setSolution}
            placeholder="اكتب حلك هنا..."
            placeholderTextColor="#999"
            multiline
            textAlign="right"
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'جاري التحقق...' : 'تقديم الحل'}
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
  headerTitle: {
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
  taskInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  projectTitle: {
    fontSize: 28,
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
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 24,
  },
  hintsButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
  },
  hintsButtonText: {
    color: '#4E7ED1',
    fontSize: 16,
    marginRight: 8,
    fontWeight: '600',
  },
  hintsContainer: {
    marginBottom: 24,
  },
  hintItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    textAlign: 'right',
  },
  solutionContainer: {
    marginBottom: 24,
  },
  solutionLabel: {
    fontSize: 16,
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
    fontSize: 16,
    minHeight: 150,
    textAlign: 'right',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4E7ED1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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
