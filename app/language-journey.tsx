import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  Dimensions, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar,
  Pressable,
  ViewStyle,
  StyleProp 
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ProjectCard from './components/ProjectCard';
import useAppStore from './store/useAppStore';

const { width, height } = Dimensions.get('window');

type TouchableProps = {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  android_ripple?: { color: string; borderless: boolean };
};

export default function LanguageJourney() {
  const params = useLocalSearchParams<{ language: string; environment: string }>();
  const router = useRouter();
  const [headerHeight, setHeaderHeight] = useState(Platform.OS === 'ios' ? 90 : 70);
  const language = useAppStore((state) =>
    state.languages.find((l) => l.name === params.language)
  );

  useEffect(() => {
    const updateLayout = () => {
      setHeaderHeight(Platform.OS === 'ios' ? 90 : 70);
    };

    const subscription = Dimensions.addEventListener('change', updateLayout);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleProjectPress = (projectId: string) => {
    router.push({
      pathname: "/project-details",
      params: {
        projectId,
        language: params.language || "",
        environment: params.environment || ""
      }
    });
  };

  if (!language) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4E7ED1" />
      <View style={[styles.header, { height: headerHeight }]}>
        <SafeAreaView style={styles.headerContent}>
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
          <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
            {params.language} - {params.environment}
          </Text>
        </SafeAreaView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
      >
        <View style={styles.content}>
          <View style={styles.projectsContainer}>
            {language.projects.map((project, index) => {
              const isLocked = index > 0 && !language.projects[index - 1].isCompleted;
              const completedTasks = project.tasks.filter(task => task.isCompleted).length;
              const totalTasks = project.tasks.length;
              const isActive = completedTasks > 0;

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onPress={() => handleProjectPress(project.id)}
                  isLocked={isLocked}
                  isActive={isActive}
                  languageId={params.language}
                />
              );
            })}
          </View>
        </View>
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
    width: '100%',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        paddingBottom: 10,
      },
      android: {
        paddingVertical: 16,
      },
      default: {
        paddingVertical: 16,
      }
    }),
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: Platform.OS === 'web' ? 'left' : 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 800 : undefined,
    alignSelf: 'center',
  },
  projectsContainer: {
    marginTop: 20,
  },
  touchable: {
    width: '100%',
  },
  projectContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
      }
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E7ED1',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui',
    }),
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'system-ui',
    }),
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 12,
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
  activeProgressLine: {
    position: 'absolute',
    top: 6,
    right: 20,
    height: 2,
    backgroundColor: '#4E7ED1',
    zIndex: 1,
  },
  progressStep: {
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
  stepLabel: {
    fontSize: 12,
    color: '#666',
    minWidth: 45,
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#4E7ED1',
    fontWeight: '500',
  },
  activeProjectCard: {
    backgroundColor: '#F5F8FF',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectText: {
    fontSize: 16,
    color: '#4E7ED1',
    textAlign: 'center',
    fontWeight: '500',
  },
  lockedProject: {
    backgroundColor: '#F5F5F5',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
