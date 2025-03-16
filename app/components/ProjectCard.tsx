import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  isLocked?: boolean;
}

export default function ProjectCard({ project, onPress, isLocked }: ProjectCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      style={[
        styles.container,
        isLocked && styles.lockedContainer,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isLocked ? (
          <>
            <MaterialIcons name="lock-outline" size={24} color="#666" style={styles.lockIcon} />
            <Text style={styles.lockText}>الرجاء اتمام المشروع السابق</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>{project.name}</Text>
            <Text style={styles.description}>{project.description}</Text>
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
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    height: 120,
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
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  lockIcon: {
    marginBottom: 8,
  },
  lockText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
