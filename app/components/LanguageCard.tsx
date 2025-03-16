import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';

type LanguageCardProps = {
  language: string;
  level: string;
  description: string;
  progress: number;
  projectProgress: number[];
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
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((step, index) => (
          <View key={step} style={styles.stepContainer}>
            <View
              style={[
                styles.diamond,
                projectProgress[step - 1] === 1 ? { backgroundColor: '#E4DB2E' } : index < progress ? styles.activeDiamond : styles.inactiveDiamond,
              ]}
            />
            <View
              style={[
                styles.line,
                index < 3 ? styles.lineVisible : styles.lineHidden,
                index < progress ? styles.activeLine : styles.inactiveLine,
              ]}
            />
          </View>
        ))}
        <View style={[styles.diamond, progress >= 4 ? styles.activeDiamond : styles.inactiveDiamond]} />
      </View>
      <View style={styles.stepLabels}>
        <Text style={[styles.stepText, progress >= 0 ? styles.activeText : styles.stepText]}>مشروع 1</Text>
        <Text style={[styles.stepText, progress >= 1 ? styles.activeText : styles.stepText]}>مشروع 2</Text>
        <Text style={[styles.stepText, progress >= 2 ? styles.activeText : styles.stepText]}>مشروع 3</Text>
        <Text style={[styles.stepText, progress >= 3 ? styles.activeText : styles.stepText]}>مشروع 4</Text>
        <Text style={[styles.stepText, progress >= 4 ? styles.activeText : styles.stepText]}>تخرج</Text>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    marginBottom: 12,
    marginTop: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  diamond: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#4E7ED1',
  },
  activeDiamond: {
    backgroundColor: '#4E7ED1',
    borderColor: '#4E7ED1',
  },
  inactiveDiamond: {
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
  },
  line: {
    height: 2,
    flex: 1,
  },
  lineVisible: {
    opacity: 1,
  },
  lineHidden: {
    opacity: 0,
  },
  activeLine: {
    backgroundColor: '#4E7ED1',
  },
  inactiveLine: {
    backgroundColor: '#E5E5E5',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    minWidth: 45,
  },
  activeText: {
    color: '#4E7ED1',
    fontWeight: '500',
  },
});
