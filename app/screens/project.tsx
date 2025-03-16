import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../store/useAppStore';
import TaskCard from '../components/TaskCard';
import { apiService } from '../services/api';

export default function Project() {
  const { languageId, projectId, autoStart } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 768;

  const language = useAppStore((state) =>
    state.languages.find((l) => l.id === languageId)
  );
  const project = language?.projects.find((p) => p.id === projectId);
  const progress = useAppStore((state) => state.progress[languageId as string]);
  const currentTaskId = progress?.currentTaskId;

  const setCurrentTask = useAppStore((state) => state.setCurrentTask);
  const completeTask = useAppStore((state) => state.completeTask);

  useEffect(() => {
    if (!project || !language) {
      router.replace('/');
      return;
    }

    // Load project content if not already loaded
    if (!project.tasks.length) {
      loadProjectContent();
    } else if (autoStart === 'true') {
      // If this is an automatic navigation, start the first incomplete task
      const firstIncompleteTask = project.tasks.find(t => !t.isCompleted);
      if (firstIncompleteTask) {
        router.replace({
          pathname: '/screens/task',
          params: {
            languageId,
            projectId,
            taskId: firstIncompleteTask.id
          }
        });
      }
    }
  }, [project, language, autoStart]);

  const loadProjectContent = async () => {
    setIsLoading(true);
    try {
      const projectNumber = parseInt(project?.id.split('-').pop() || '1');
      const content = await apiService.generateProject({
        language: language?.name.toLowerCase() || '',
        level: language?.level || 'Beginner',
        goal: language?.goal || '',
        projectNumber,
      });

      useAppStore.getState().updateProjectContent(
        languageId as string,
        projectId as string,
        content
      );
    } catch (error) {
      console.error('Error loading project content:', error);
      Alert.alert(
        'خطأ',
        'حدث خطأ أثناء تحميل محتوى المشروع. الرجاء المحاولة مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskPress = async (taskId: string) => {
    const task = project?.tasks.find((t) => t.id === taskId);
    if (!task || task.isLocked) return;

    setCurrentTask(languageId as string, taskId);

    try {
      const taskHints = await apiService.getProjectHints(
        language?.name || '',
        projectId as string,
        taskId
      );
      setHints(taskHints);
    } catch (error) {
      console.error('Error fetching hints:', error);
    }

    router.push({
      pathname: '/screens/task',
      params: { languageId, projectId, taskId },
    });
  };

  if (!project || !language) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
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
          {project.name}
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
        {isLoading ? (
          <ActivityIndicator color="#4E7ED1" style={styles.loader} />
        ) : (
          <>
            <View style={styles.projectInfo}>
              <Text style={styles.languageTitle}>
                {language.name} - {language.environment}
              </Text>
              <Text style={styles.projectDescription}>{project.description}</Text>
            </View>

            {project?.learningObjectives && (
              <View style={styles.objectivesContainer}>
                <Text style={styles.objectivesTitle}>أهداف التعلم:</Text>
                {project.learningObjectives.map((objective, index) => (
                  <Text key={index} style={styles.objectiveItem}>• {objective}</Text>
                ))}
              </View>
            )}

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                {project.tasks.map((task, index) => (
                  <View key={task.id} style={styles.taskIndicator}>
                    <View
                      style={[
                        styles.diamond,
                        task.isCompleted ? styles.activeDiamond : styles.inactiveDiamond,
                      ]}
                    />
                    <Text style={styles.taskLabel}>{`مهمة ${index + 1}`}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.tasksContainer}>
              {project?.tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => {
                    if (!task.isLocked) {
                      router.push({
                        pathname: '/screens/task',
                        params: { languageId, projectId, taskId: task.id }
                      });
                    }
                  }}
                  isLocked={task.isLocked}
                  isActive={!task.isCompleted && !task.isLocked}
                />
              ))}
            </View>
          </>
        )}
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
  projectInfo: {
    marginBottom: 24,
  },
  languageTitle: {
    fontSize: Platform.select({
      ios: 28,
      android: 24,
      default: 28,
    }),
    fontWeight: 'bold',
    color: '#4E7ED1',
    marginBottom: 12,
    textAlign: 'right',
  },
  projectDescription: {
    fontSize: Platform.select({
      ios: 14,
      android: 13,
      default: 14,
    }),
    color: '#666',
    lineHeight: 22,
    textAlign: 'right',
  },
  progressContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  progressBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 8,
  },
  taskIndicator: {
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 4,
  },
  diamond: {
    width: Platform.select({
      ios: 12,
      android: 10,
      default: 12,
    }),
    height: Platform.select({
      ios: 12,
      android: 10,
      default: 12,
    }),
    transform: [{ rotate: '45deg' }],
    marginBottom: 8,
  },
  activeDiamond: {
    backgroundColor: '#4E7ED1',
    borderColor: '#4E7ED1',
  },
  inactiveDiamond: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  taskLabel: {
    fontSize: Platform.select({
      ios: 12,
      android: 11,
      default: 12,
    }),
    color: '#666',
    minWidth: 45,
    textAlign: 'center',
  },
  tasksContainer: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  loader: {
    marginTop: 32,
  },
  objectivesContainer: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  objectivesTitle: {
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
  objectiveItem: {
    fontSize: Platform.select({
      ios: 14,
      android: 13,
      default: 14,
    }),
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
});
