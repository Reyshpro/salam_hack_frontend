import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';

type LanguageCardProps = {
  language: string;
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
};

export default function LanguageCard({ 
  language, 
  level, 
  description, 
  progress, 
  projectProgress,
  isActive = false, 
  onDelete,
  environment 
}: LanguageCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/language-journey',
      params: { language, environment }
    });
  };

  // Calculate overall progress percentage for the progress line
  const calculateProgressPercentage = (index: number) => {
    if (index >= projectProgress.length) return 0;
    
    const completedProjects = projectProgress.slice(0, index + 1)
      .reduce((sum, project) => sum + (project.isCompleted ? 1 : project.completedTasks / project.totalTasks), 0);
    
    return (completedProjects / (index + 1)) * 100;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.levelGroup}>
          {onDelete && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={onDelete}
              accessibilityLabel="حذف اللغة"
            >
              <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.level}>{level}</Text>
        </View>
        <View style={styles.titleGroup}>
          <View style={styles.languageRow}>
            {environment && (
              <>
                <Text style={styles.environment}>{environment}</Text>
                <Text style={styles.separator}> - </Text>
              </>
            )}
            <Text style={styles.language}>{language}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.progressWrapper}>
        <View style={styles.progressBackground} />
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3, 4].map((index) => {
            const project = projectProgress[index];
            const isCompleted = project?.isCompleted;
            const taskProgress = project ? project.completedTasks / project.totalTasks : 0;
            
            return (
              <View key={index} style={styles.stepContainer}>
                <View
                  style={[
                    styles.diamond,
                    isCompleted ? styles.completedDiamond : 
                    taskProgress > 0 ? styles.activeDiamond : 
                    styles.inactiveDiamond,
                  ]}
                />
                {index < 4 && (
                  <View
                    style={[
                      styles.line,
                      styles.lineBase,
                      {
                        backgroundColor: '#E5E5E5',
                        overflow: 'hidden',
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.progressLine,
                        {
                          width: `${calculateProgressPercentage(index)}%`,
                          backgroundColor: '#4E7ED1',
                        }
                      ]}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.stepLabels}>
          <Text style={[styles.stepText, projectProgress[0]?.completedTasks > 0 ? styles.activeText : styles.stepText]}>
            مشروع 1{projectProgress[0]?.completedTasks ? ` (${projectProgress[0].completedTasks}/${projectProgress[0].totalTasks})` : ''}
          </Text>
          <Text style={[styles.stepText, projectProgress[1]?.completedTasks > 0 ? styles.activeText : styles.stepText]}>
            مشروع 2{projectProgress[1]?.completedTasks ? ` (${projectProgress[1].completedTasks}/${projectProgress[1].totalTasks})` : ''}
          </Text>
          <Text style={[styles.stepText, projectProgress[2]?.completedTasks > 0 ? styles.activeText : styles.stepText]}>
            مشروع 3{projectProgress[2]?.completedTasks ? ` (${projectProgress[2].completedTasks}/${projectProgress[2].totalTasks})` : ''}
          </Text>
          <Text style={[styles.stepText, projectProgress[3]?.completedTasks > 0 ? styles.activeText : styles.stepText]}>
            مشروع 4{projectProgress[3]?.completedTasks ? ` (${projectProgress[3].completedTasks}/${projectProgress[3].totalTasks})` : ''}
          </Text>
          <Text style={[styles.stepText, projectProgress[4]?.completedTasks > 0 ? styles.activeText : styles.stepText]}>
            تخرج{projectProgress[4]?.completedTasks ? ` (${projectProgress[4].completedTasks}/${projectProgress[4].totalTasks})` : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  levelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleGroup: {
    alignItems: 'flex-end',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  language: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E7ED1',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  separator: {
    fontSize: 28,
    color: '#666',
    marginHorizontal: 12,
    opacity: 0.3,
    fontWeight: '300',
  },
  environment: {
    fontSize: 28,
    color: '#666',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
    opacity: 0.8,
    fontWeight: '400',
  },
  level: {
    fontSize: 18,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 'auto',
  },
  deleteButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  deleteIcon: {
    color: '#666',
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: -1,
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  progressWrapper: {
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    top: 14,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: '#E5E5E5',
    zIndex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    position: 'relative',
    zIndex: 2,
  },
  stepContainer: {
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
  completedDiamond: {
    backgroundColor: '#E4DB2E',
    borderColor: '#E4DB2E',
  },
  activeDiamond: {
    backgroundColor: '#4E7ED1',
    borderColor: '#4E7ED1',
  },
  inactiveDiamond: {
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
  },
  lineBase: {
    position: 'absolute',
    height: 2,
    left: 20,
    right: -60,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    height: 2,
    left: 10,
    right: -60,
    zIndex: 1,
  },
  progressLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  stepText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    minWidth: 45,
  },
  activeText: {
    color: '#4E7ED1',
    fontWeight: '500',
  },
});
