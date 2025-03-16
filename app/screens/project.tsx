import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../store/useAppStore';
import TaskCard from '../components/TaskCard';
import { apiService } from '../services/api';

export default function Project() {
  const { languageId, projectId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [hints, setHints] = useState<string[]>([]);

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

    loadProjectContent();
  }, [project, language]);

  const loadProjectContent = async () => {
    if (!project?.tasks.length) {
      setIsLoading(true);
      try {
        const projectNumber = parseInt(project.id.split('-').pop() || '1');
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
      } finally {
        setIsLoading(false);
      }
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
      pathname: '/task',
      params: { languageId, projectId, taskId },
    });
  };

  if (!project || !language) return null;

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
        <Text style={styles.headerTitle}>{project.name}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.projectInfo}>
          <Text style={styles.languageTitle}>
            {language.name} - {language.environment}
          </Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
        </View>

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

        {isLoading ? (
          <ActivityIndicator color="#4E7ED1" style={styles.loader} />
        ) : (
          <View style={styles.tasksContainer}>
            {project.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
                isLocked={task.isLocked}
                isActive={task.id === currentTaskId}
              />
            ))}
          </View>
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
  projectInfo: {
    marginBottom: 24,
  },
  languageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E7ED1',
    marginBottom: 12,
    textAlign: 'right',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'right',
  },
  progressContainer: {
    marginBottom: 32,
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
  },
  diamond: {
    width: 12,
    height: 12,
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
    fontSize: 12,
    color: '#666',
    minWidth: 45,
    textAlign: 'center',
  },
  tasksContainer: {
    marginTop: 16,
  },
  loader: {
    marginTop: 32,
  },
});
