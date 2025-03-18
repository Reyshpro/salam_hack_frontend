import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Language } from '../types';
import ProjectCard from './ProjectCard';
import useAppStore from '../store/useAppStore';

type LanguageCardProps = {
  language: Language;
  level: string;
  description: string;
  progress: number;
  projectProgress: {
    projectId: string;
    completedTasks: number;
    totalTasks: number;
    isCompleted: boolean;
  }[];
  isActive?: boolean;
  onDelete?: () => void;
  environment?: string;
  isLocked?: boolean;
};

export default function LanguageCard({ 
  language, 
  level, 
  description, 
  progress, 
  projectProgress,
  isActive = false, 
  onDelete,
  environment,
  isLocked
}: LanguageCardProps) {
  const router = useRouter();
  const completeProject = useAppStore((state) => state.completeProject);
  const completedProjects = projectProgress.filter(project => project.isCompleted).length;
  const totalProjects = projectProgress.length;
  const progressPercentage = (completedProjects / totalProjects) * 100;

  const handlePress = () => {
    router.push({
      pathname: '/language-journey',
      params: { language: language.name, environment }
    });
  };

  const handleProjectPress = (projectId: string) => {
    if (!isLocked) {
      completeProject(language.id, projectId);
    }
  };

  return (
    <View style={[
      styles.container,
      isLocked && styles.lockedContainer,
      isActive && styles.activeContainer,
    ]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLocked}
        style={styles.header}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>{language.name}</Text>
          <Text style={styles.description}>{description}</Text>
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
              {projectProgress.map((project, index) => {
                const isProjectLocked = index > 0 && !project.isCompleted;
                return (
                  <View key={project.projectId} style={styles.projectIndicator}>
                    <View
                      style={[
                        styles.diamond,
                        project.isCompleted ? styles.activeDiamond : styles.inactiveDiamond,
                      ]}
                    />
                    <Text
                      style={[
                        styles.projectLabel,
                        project.isCompleted && styles.activeProjectLabel,
                      ]}
                    >
                      {`مشروع ${index + 1}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.projectsContainer}>
        {language.projects.map((project, index) => {
          const isProjectLocked = index > 0 && !language.projects[index - 1].isCompleted;
          const isProjectActive = !isProjectLocked && !project.isCompleted;

          return (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => handleProjectPress(project.id)}
              isLocked={isProjectLocked}
              isActive={isProjectActive}
              languageId={language.id}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E7ED1',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
    position: 'relative',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    position: 'relative',
    zIndex: 2,
  },
  progressLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 1,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#4E7ED1',
  },
  projectIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    position: 'relative',
  },
  diamond: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    borderWidth: 1,
    borderColor: '#4E7ED1',
    backgroundColor: '#fff',
    zIndex: 3,
  },
  activeDiamond: {
    backgroundColor: '#E4DB2E',
    borderColor: '#E4DB2E',
  },
  inactiveDiamond: {
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
  },
  projectLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    minWidth: 45,
  },
  activeProjectLabel: {
    color: '#4E7ED1',
    fontWeight: '500',
  },
  projectsContainer: {
    marginTop: 12,
  },
  lockedContainer: {
    backgroundColor: '#f5f5f5',
  },
  activeContainer: {
    backgroundColor: '#fff',
  },
});
