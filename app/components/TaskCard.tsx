import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  isLocked?: boolean;
  isActive?: boolean;
}

export default function TaskCard({ 
  task, 
  onPress, 
  isLocked, 
  isActive 
}: TaskCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      style={[
        styles.container,
        isLocked && styles.lockedContainer,
        isActive && styles.activeContainer,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isLocked ? (
          <>
            <MaterialIcons 
              name="lock-outline" 
              size={24} 
              color="#666" 
              style={styles.lockIcon} 
            />
            <Text style={styles.lockText}>
              الرجاء اتمام المهمة السابقة
            </Text>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{task.title}</Text>
              {task.isCompleted && (
                <MaterialIcons 
                  name="check-circle" 
                  size={24} 
                  color="#4E7ED1" 
                  style={styles.checkIcon} 
                />
              )}
            </View>
            <Text style={styles.description}>{task.description}</Text>
            {isActive && (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={onPress}
              >
                <Text style={styles.buttonText}>
                  {task.isCompleted ? 'مراجعة المهمة' : 'ابدأ المهمة'}
                </Text>
              </TouchableOpacity>
            )}
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
    overflow: 'hidden',
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
    borderColor: '#4E7ED1',
    borderWidth: 2,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
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
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui',
    }),
  },
  lockIcon: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    marginLeft: 12,
  },
  lockText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4E7ED1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui',
    }),
  },
});
