import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Project, Task } from '../types';
import TaskCard from './TaskCard';
import useAppStore from '../store/useAppStore';
import SkeletonLoader from './SkeletonLoader';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  isLocked?: boolean;
  isActive?: boolean;
  languageId: string;
  isLoading?: boolean;
}

export default function ProjectCard({ 
  project, 
  onPress, 
  isLocked,
  isActive = false,
  languageId,
  isLoading = false
}: ProjectCardProps) {
  const completeTask = useAppStore((state) => state.completeTask);
  const completeProject = useAppStore((state) => state.completeProject);
  const completedTasks = project.tasks.filter(task => task.isCompleted).length;
  const totalTasks = project.tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const handleTaskPress = (taskId: string) => {
    if (!isLocked) {
      completeTask(languageId, project.id, taskId);
      
      // Check if all tasks are completed
      const updatedCompletedTasks = completedTasks + 1;
      if (updatedCompletedTasks === totalTasks) {
        completeProject(languageId, project.id);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingHeader}>
          <SkeletonLoader width={250} height={24} style={styles.titleSkeleton} />
          <SkeletonLoader width={300} height={16} style={styles.descriptionSkeleton} />
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressLine}>
                <SkeletonLoader width="100%" height={2} style={styles.progressSkeleton} />
              </View>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <View key={index} style={styles.taskIndicator}>
                  <SkeletonLoader width={12} height={12} style={styles.diamondSkeleton} />
                  <SkeletonLoader width={45} height={12} style={styles.taskLabelSkeleton} />
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.loadingTasks}>
          {[1, 2, 3].map((_, index) => (
            <TaskCard 
              key={index} 
              task={{ 
                id: `loading-${index}`,
                title: '',
                description: '',
                isCompleted: false,
                isLocked: false
              } as Task} 
              onPress={() => {}} 
              isLoading={true}
              languageId={languageId}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      isLocked && styles.lockedContainer,
      isActive && styles.activeContainer,
    ]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isLocked}
        style={styles.header}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.description}>{project.description}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressLine}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              {project.tasks.map((task, index) => (
                <View key={task.id} style={styles.taskIndicator}>
                  <View
                    style={[
                      styles.diamond,
                      task.isCompleted ? styles.activeDiamond : styles.inactiveDiamond,
                    ]}
                  />
                  <Text
                    style={[
                      styles.taskLabel,
                      task.isCompleted && styles.activeTaskLabel,
                    ]}
                  >
                    {`مهمة ${index + 1}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.tasksContainer}>
        {project.tasks.map((task, index) => {
          const isTaskLocked = index > 0 && !project.tasks[index - 1].isCompleted;
          const isTaskActive = !isTaskLocked && !task.isCompleted;

          return (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task.id)}
              isLocked={isTaskLocked}
              isActive={isTaskActive}
              languageId={languageId}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  lockedContainer: {
    backgroundColor: '#F5F5F5',
  },
  activeContainer: {
    backgroundColor: '#F5F8FF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'right',
    alignSelf: 'stretch',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui',
    }),
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 24,
    alignSelf: 'stretch',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui',
    }),
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: 28,
  },
  progressLine: {
    position: 'absolute',
    top: 6,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#E5E5E5',
    zIndex: 0,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#4E7ED1',
    zIndex: 1,
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
  activeTaskLabel: {
    color: '#4E7ED1',
    fontWeight: '500',
  },
  tasksContainer: {
    padding: 16,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  loadingHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleSkeleton: {
    marginBottom: 12,
  },
  descriptionSkeleton: {
    marginBottom: 24,
  },
  progressSkeleton: {
    marginBottom: 8,
  },
  diamondSkeleton: {
    marginBottom: 8,
  },
  taskLabelSkeleton: {
    marginBottom: 8,
  },
  loadingTasks: {
    padding: 16,
  },
});
