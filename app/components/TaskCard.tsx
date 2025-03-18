import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '../types';
import SkeletonLoader from './SkeletonLoader';
import HelpPopup from './HelpPopup';
import { generateTaskHelp } from '../services/ai/helpGenerator';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  isLocked?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  languageId: string;
}

export default function TaskCard({
  task,
  onPress,
  isLocked = false,
  isActive = false,
  isLoading = false,
  languageId,
}: TaskCardProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [isGeneratingHelp, setIsGeneratingHelp] = useState(false);

  const handleHelpPress = async () => {
    setShowHelp(true);
    setIsGeneratingHelp(true);
    try {
      const help = await generateTaskHelp(task, languageId);
      setHelpText(help);
    } catch (error) {
      setHelpText('عذراً، حدث خطأ أثناء توليد المساعدة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingHelp(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <SkeletonLoader width={200} height={24} style={styles.titleSkeleton} />
          <SkeletonLoader width={300} height={16} style={styles.descriptionSkeleton} />
        </View>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        disabled={isLocked}
        style={[
          styles.container,
          isLocked && styles.lockedContainer,
          isActive && styles.activeContainer,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleHelpPress}
              style={styles.helpButton}
              disabled={isLocked}
            >
              <MaterialIcons name="help-outline" size={24} color="#4E7ED1" />
            </TouchableOpacity>
            <View style={styles.checkbox}>
              {task.isCompleted && (
                <MaterialIcons name="check-circle" size={24} color="#4E7ED1" />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <HelpPopup
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
        isLoading={isGeneratingHelp}
        helpText={helpText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  loadingContainer: {
    backgroundColor: '#fff',
  },
  loadingContent: {
    padding: 16,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  descriptionSkeleton: {
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    padding: 8,
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedContainer: {
    backgroundColor: '#f5f5f5',
  },
  activeContainer: {
    backgroundColor: '#f8f9fa',
  },
});
