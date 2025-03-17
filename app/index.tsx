import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import LanguageCard from './components/LanguageCard';
import { storage, Language, Journey } from './utils/storage';
import { displayLearnings, Learning } from './services/api/test';

const { width } = Dimensions.get('window');

const languageDescriptions: { [key: string]: string } = {
  cpp: 'لغة برمجة قوية وفعالة. تستخدم في تطوير البرامج عالية الأداء والألعاب وأنظمة التشغيل. مثالية لفهم أساسيات البرمجة وإدارة الذاكرة.',
  python: 'لغة برمجة سهلة التعلم وقوية. مثالية للمبتدئين وتستخدم في تطوير الويب والذكاء الاصطناعي وتحليل البيانات. تتميز بقواعد بسيطة وواضحة.',
  javascript: 'لغة برمجة أساسية لتطوير الويب. تستخدم لإنشاء مواقع تفاعلية وتطبيقات الويب الحديثة. مطلوبة بشدة في سوق العمل.',
  java: 'لغة برمجة قوية وموثوقة. تستخدم في تطوير تطبيقات الأندرويد والأنظمة المؤسسية. تتميز بإمكانية التشغيل على جميع المنصات.',
  csharp: 'لغة برمجة متعددة الأغراض من مايكروسوفت. تستخدم في تطوير تطبيقات الويندوز والألعاب باستخدام Unity وتطبيقات الويب.',
  swift: 'لغة برمجة حديثة من Apple. تستخدم في تطوير تطبيقات iOS وmacOS. تتميز بالأداء العالي والأمان.',
  kotlin: 'لغة برمجة حديثة متوافقة مع Java. الخيار المفضل لتطوير تطبيقات Android. تتميز بالسلامة والتعبيرية.',
  php: 'لغة برمجة مفتوحة المصدر لتطوير الويب. تستخدم في إنشاء المواقع الديناميكية وتطبيقات الويب. سهلة التعلم ومدعومة بشكل واسع.',
  ruby: 'لغة برمجة ديناميكية وبسيطة. مشهورة في تطوير الويب مع إطار Ruby on Rails. تركز على سعادة المطور وإنتاجيته.',
  typescript: 'نسخة معززة من JavaScript مع إضافة الأنواع. تحسن جودة الكود وقابلية الصيانة. مثالية للمشاريع الكبيرة.',
  go: 'لغة برمجة من Google تركز على البساطة والكفاءة. مثالية للخدمات السحابية والبرمجة المتزامنة. سريعة وسهلة التعلم.',
  rust: 'لغة برمجة حديثة تركز على الأمان والأداء. مثالية للبرمجة على مستوى النظام والتطبيقات عالية الأداء.',
  r: 'لغة برمجة متخصصة في التحليل الإحصائي وعلوم البيانات. قوية في معالجة البيانات والتصور. مدعومة بمكتبات غنية.',
  dart: 'لغة برمجة من Google لتطوير تطبيقات عبر المنصات. تستخدم مع إطار Flutter لتطوير تطبيقات الموبايل الجميلة.',
  sql: 'لغة استعلام هيكلية للتعامل مع قواعد البيانات. أساسية لتخزين واسترجاع البيانات. مطلوبة في معظم تطبيقات البرمجة.'
};

export default function App() {
  
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const params = useLocalSearchParams<{ newJourney?: string }>();
  const [learningData, setLearningData] = useState<Learning[] | null>(null);

  // Load saved languages on mount
  useEffect(() => {
    const loadSavedLanguages = async () => {
      try {
        const savedLanguages = await storage.getLanguages();
        setLanguages(savedLanguages);
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    };
    loadSavedLanguages();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // setIsLoading(true);
        // Load learning data
        const data = await displayLearnings('55');
        setLearningData(data || null);
        
        // Load saved languages
        const savedLanguages = await storage.getLanguages();
        setLanguages(savedLanguages);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // setIsLoading(false);
      }
    };
    
    loadData();
  }, []);


  // Handle adding new language
  useEffect(() => {
    const addNewLanguage = async () => {
      if (!params.newJourney || isAddingLanguage) return;

      setIsAddingLanguage(true);
      try {
        const journey = JSON.parse(params.newJourney) as Journey;
        const normalizedLanguage = journey.language.toLowerCase();
        
        // Format language name
        const displayName = normalizedLanguage === 'cpp' 
          ? 'C++' 
          : journey.language.charAt(0).toUpperCase() + journey.language.slice(1);

        // Check if language already exists (case-insensitive)
        const languageExists = languages.some(
          lang => lang.language.toLowerCase() === displayName.toLowerCase()
        );

        if (!languageExists) {
          const newLanguage: Language = {
            language: displayName,
            level: journey.level,
            description: languageDescriptions[normalizedLanguage] || '',
            progress: 0,
            environment: journey.environment || '',
          };

          await storage.addLanguage(newLanguage);
          setLanguages(prev => [...prev, newLanguage]);
        }
      } catch (error) {
        console.error('Error adding new language:', error);
      } finally {
        setIsAddingLanguage(false);
      }
    };

    addNewLanguage();
  }, [params.newJourney]);

  const handleStartJourney = useCallback(() => {
    router.push('/new-journey');
  }, []);

  const handleDeleteLanguage = useCallback(async (languageToDelete: string) => {
    if (!languageToDelete) return;

    try {
      // Optimistic update
      setLanguages(prev => prev.filter(lang => 
        lang.language.toLowerCase() !== languageToDelete.toLowerCase()
      ));
      
      await storage.removeLanguage(languageToDelete);
    } catch (error) {
      // Rollback on error
      console.error('Error deleting language:', error);
      const savedLanguages = await storage.getLanguages();
      setLanguages(savedLanguages);
    }
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#4E7ED1" barStyle="light-content" translucent={true} />
      <View style={styles.wrapper}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.headerText}>استعد لاكتشاف عالم البرمجة</Text>
                <Text style={styles.headerText}>وتطوير مهاراتك بشكل مميز!</Text>
                <Text style={styles.subHeaderText}>ابدأ مشروع جديد عن طريق الضفط على الزر</Text>
              </View>
            </View>

            <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
              {learningData ? (
                learningData.map((lang) => (
                  <LanguageCard
                    key={lang.language.toLowerCase()}
                    language={lang.language}
                    level={lang.level}
                    description={lang.description}
                    progress={1} 
                    projectProgress={[
                      { projectId: 'proj1', completedTasks: 1, totalTasks: 5, isCompleted: false },
                      { projectId: 'proj2', completedTasks: 0, totalTasks: 5, isCompleted: false },
                      { projectId: 'proj3', completedTasks: 0, totalTasks: 5, isCompleted: false },
                      { projectId: 'proj4', completedTasks: 0, totalTasks: 5, isCompleted: false },
                      { projectId: 'proj5', completedTasks: 0, totalTasks: 5, isCompleted: false }
                    ]}
                    isActive={true}
                    onDelete={() => handleDeleteLanguage(lang.language)}
                    environment={lang.framework}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>لم تبدأ أي رحلة بعد</Text>
                  <Text style={styles.emptyStateSubText}>اضغط على زر "إبدأ رحلة جديدة" لبدء رحلتك الأولى</Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.bottomButton} onPress={handleStartJourney}>
              <Text style={styles.buttonText}>+ إبدأ رحلة جديدة</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#4E7ED1',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#4E7ED1',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 0,
  },
  header: {
    width: '100%',
    backgroundColor: '#4E7ED1',
    paddingTop: 0,
  },
  headerContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
  },
  headerText: {
    color: '#fff',
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
    
    marginBottom: 4,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  subHeaderText: {
    color: '#fff',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 12,
    opacity: 0.9,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    maxWidth: Platform.select({ web: 800, default: undefined }),
    alignSelf: Platform.select({ web: 'center', default: undefined }),
  },
  bottomButton: {
    backgroundColor: '#4E7ED1',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4E7ED1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    maxWidth: 250,
  },
});
