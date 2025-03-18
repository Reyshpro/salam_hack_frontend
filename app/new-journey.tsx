import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { storage } from './utils/storage';

const languages = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'R', value: 'r' },
  { label: 'Dart', value: 'dart' },
  { label: 'SQL', value: 'sql' },
];

const frameworksByLanguage = {
  python: [
    { label: 'Django', value: 'django' },
    { label: 'Flask', value: 'flask' },
    { label: 'FastAPI', value: 'fastapi' },
    { label: 'TensorFlow', value: 'tensorflow' },
    { label: 'PyTorch', value: 'pytorch' },
    { label: 'OpenCV', value: 'opencv' },
    { label: 'Pandas', value: 'pandas' },
    { label: 'NumPy', value: 'numpy' },
    { label: 'Scrapy', value: 'scrapy' },
    { label: 'PyGame', value: 'pygame' },
  ],
  javascript: [
    { label: 'React.js', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Express.js', value: 'express' },
    { label: 'Node.js', value: 'node' },
    { label: 'Next.js', value: 'next' },
    { label: 'Nuxt.js', value: 'nuxt' },
    { label: 'Electron.js', value: 'electron' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'NestJS', value: 'nest' },
  ],
  cpp: [
    { label: 'Qt', value: 'qt' },
    { label: 'Boost', value: 'boost' },
    { label: 'Unreal Engine', value: 'unreal' },
    { label: 'Cocos2d-x', value: 'cocos2d' },
    { label: 'OpenCV', value: 'opencv' },
    { label: 'SFML', value: 'sfml' },
    { label: 'CUDA', value: 'cuda' },
    { label: 'POCO C++', value: 'poco' },
    { label: 'JUCE', value: 'juce' },
    { label: 'Catch2', value: 'catch2' },
  ],
  java: [
    { label: 'Spring Boot', value: 'spring' },
    { label: 'Hibernate', value: 'hibernate' },
    { label: 'JavaFX', value: 'javafx' },
    { label: 'Apache Struts', value: 'struts' },
    { label: 'Play Framework', value: 'play' },
    { label: 'Vaadin', value: 'vaadin' },
    { label: 'Micronaut', value: 'micronaut' },
    { label: 'JUnit', value: 'junit' },
    { label: 'Quarkus', value: 'quarkus' },
    { label: 'Jakarta EE', value: 'jakarta' },
  ],
  csharp: [
    { label: '.NET Core', value: 'dotnet' },
    { label: 'ASP.NET', value: 'aspnet' },
    { label: 'Entity Framework', value: 'ef' },
    { label: 'Unity', value: 'unity' },
    { label: 'Blazor', value: 'blazor' },
    { label: 'Xamarin', value: 'xamarin' },
    { label: 'WPF', value: 'wpf' },
    { label: 'SignalR', value: 'signalr' },
    { label: 'NancyFX', value: 'nancy' },
    { label: 'NLog', value: 'nlog' },
  ],
  swift: [
    { label: 'SwiftUI', value: 'swiftui' },
    { label: 'UIKit', value: 'uikit' },
    { label: 'Vapor', value: 'vapor' },
    { label: 'CoreData', value: 'coredata' },
    { label: 'Combine', value: 'combine' },
    { label: 'RxSwift', value: 'rxswift' },
    { label: 'Alamofire', value: 'alamofire' },
    { label: 'SpriteKit', value: 'spritekit' },
    { label: 'SceneKit', value: 'scenekit' },
    { label: 'TensorFlow Swift', value: 'tensorflow-swift' },
  ],
  kotlin: [
    { label: 'Ktor', value: 'ktor' },
    { label: 'Jetpack Compose', value: 'compose' },
    { label: 'Spring Boot', value: 'spring' },
    { label: 'Android Jetpack', value: 'jetpack' },
    { label: 'Koin', value: 'koin' },
    { label: 'SQLDelight', value: 'sqldelight' },
    { label: 'Exposed', value: 'exposed' },
    { label: 'TornadoFX', value: 'tornadofx' },
    { label: 'Dagger', value: 'dagger' },
    { label: 'Retrofit', value: 'retrofit' },
  ],
  php: [
    { label: 'Laravel', value: 'laravel' },
    { label: 'Symfony', value: 'symfony' },
    { label: 'CodeIgniter', value: 'codeigniter' },
    { label: 'Zend Framework', value: 'zend' },
    { label: 'CakePHP', value: 'cake' },
    { label: 'Yii', value: 'yii' },
    { label: 'Slim', value: 'slim' },
    { label: 'Phalcon', value: 'phalcon' },
    { label: 'Drupal', value: 'drupal' },
    { label: 'Magento', value: 'magento' },
  ],
  ruby: [
    { label: 'Ruby on Rails', value: 'rails' },
    { label: 'Sinatra', value: 'sinatra' },
    { label: 'Hanami', value: 'hanami' },
    { label: 'Padrino', value: 'padrino' },
    { label: 'Grape', value: 'grape' },
    { label: 'Sidekiq', value: 'sidekiq' },
    { label: 'RSpec', value: 'rspec' },
    { label: 'Sequel', value: 'sequel' },
    { label: 'Capybara', value: 'capybara' },
    { label: 'Devise', value: 'devise' },
  ],
  typescript: [
    { label: 'Angular', value: 'angular' },
    { label: 'NestJS', value: 'nest' },
    { label: 'Next.js', value: 'next' },
    { label: 'Nuxt.js', value: 'nuxt' },
    { label: 'Express.js', value: 'express' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Ionic', value: 'ionic' },
    { label: 'Electron', value: 'electron' },
    { label: 'RxJS', value: 'rxjs' },
    { label: 'Deno', value: 'deno' },
  ],
  go: [
    { label: 'Gin', value: 'gin' },
    { label: 'Echo', value: 'echo' },
    { label: 'Fiber', value: 'fiber' },
    { label: 'Revel', value: 'revel' },
    { label: 'Beego', value: 'beego' },
    { label: 'GORM', value: 'gorm' },
    { label: 'Go Kit', value: 'gokit' },
    { label: 'Buffalo', value: 'buffalo' },
    { label: 'Kratos', value: 'kratos' },
    { label: 'Cobra', value: 'cobra' },
  ],
  rust: [
    { label: 'Rocket', value: 'rocket' },
    { label: 'Actix', value: 'actix' },
    { label: 'Axum', value: 'axum' },
    { label: 'Tokio', value: 'tokio' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Warp', value: 'warp' },
    { label: 'Serde', value: 'serde' },
    { label: 'Tauri', value: 'tauri' },
    { label: 'Yew', value: 'yew' },
    { label: 'Bevy', value: 'bevy' },
  ],
  r: [
    { label: 'Shiny', value: 'shiny' },
    { label: 'ggplot2', value: 'ggplot2' },
    { label: 'Tidyverse', value: 'tidyverse' },
    { label: 'Plumber', value: 'plumber' },
    { label: 'R Markdown', value: 'rmarkdown' },
    { label: 'Data.table', value: 'datatable' },
    { label: 'Caret', value: 'caret' },
    { label: 'Rcpp', value: 'rcpp' },
    { label: 'Bioconductor', value: 'bioconductor' },
    { label: 'Plotly', value: 'plotly' },
  ],
  dart: [
    { label: 'Flutter', value: 'flutter' },
    { label: 'Aqueduct', value: 'aqueduct' },
    { label: 'Angel', value: 'angel' },
    { label: 'Shelf', value: 'shelf' },
    { label: 'RxDart', value: 'rxdart' },
    { label: 'Dart Frog', value: 'dartfrog' },
    { label: 'Mason', value: 'mason' },
    { label: 'GetX', value: 'getx' },
    { label: 'Riverpod', value: 'riverpod' },
    { label: 'Flame', value: 'flame' },
  ],
  sql: [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'SQLite', value: 'sqlite' },
    { label: 'Microsoft SQL Server', value: 'mssql' },
    { label: 'Oracle DB', value: 'oracle' },
    { label: 'Redis', value: 'redis' },
    { label: 'Apache Cassandra', value: 'cassandra' },
    { label: 'Firebase Firestore', value: 'firestore' },
    { label: 'Amazon RDS', value: 'rds' },
    { label: 'GraphQL', value: 'graphql' },
  ],
};

const environments = [
  { label: 'تطوير الويب', value: 'web' },
  { label: 'تطوير تطبيقات الموبايل', value: 'mobile' },
  { label: 'تطوير الألعاب', value: 'games' },
  { label: 'علم البيانات والذكاء الاصطناعي', value: 'ai' },
  { label: 'الأمن السيبراني', value: 'cyber' },
  { label: 'علم تحليل البيانات', value: 'data' },
  { label: 'الأنظمة المدمجة وانترنت الأشياء', value: 'embeded' }
];

const goals = [
  { label: 'أهدف إلى التخصص في تطوير الويب', value: 'web_development' },
  { label: 'أهدف إلى التخصص في تطوير تطبيقات الموبايل', value: 'mobile_development' },
  { label: 'أهدف إلى التخصص في تطوير الألعاب', value: 'game_development' },
  { label: 'أهدف إلى التخصص في علم البيانات والذكاء الاصطناعي', value: 'ai_data_science' },
  { label: 'أهدف إلى التخصص في الأمن السيبراني', value: 'cybersecurity' },
  { label: 'أهدف إلى التخصص في تحليل البيانات', value: 'data_analysis' },
  { label: 'أهدف إلى التخصص في الأنظمة المدمجة وإنترنت الأشياء', value: 'iot_embedded' },
];

const levels = [
  { label: 'مبتدئ', value: 'مبتدئ' },
  { label: 'متوسط', value: 'متوسط' },
  { label: 'متقدم', value: 'متقدم' },
];

const projectProgressData = [
  { projectId: 'proj1', completedTasks: 3, totalTasks: 5, isCompleted: false },
  { projectId: 'proj2', completedTasks: 0, totalTasks: 5, isCompleted: false },
  { projectId: 'proj3', completedTasks: 0, totalTasks: 5, isCompleted: false },
  { projectId: 'proj4', completedTasks: 0, totalTasks: 5, isCompleted: false },
  { projectId: 'proj5', completedTasks: 0, totalTasks: 5, isCompleted: false }
];

type LanguageKey = keyof typeof frameworksByLanguage;

export default function NewJourney() {
  const [language, setLanguage] = useState<LanguageKey | ''>('');
  const [framework, setFramework] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');

  // Reset framework when language changes
  useEffect(() => {
    setFramework('');
  }, [language]);

  const handleAddJourney = () => {
    if (!language || !framework || !goal || !level) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    
    const journeyData = {
      language,
      environment: framework,
      goal,
      level,
      progress: 0,
      startDate: new Date().toISOString(),
    };

    // Navigate back with the new journey data
    router.replace({
      pathname: '/',
      params: { newJourney: JSON.stringify(journeyData) }
    });
  };

  
  const availableFrameworks = language ? frameworksByLanguage[language] || [] : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>  
        <TouchableOpacity 
          style={[styles.exitButton, { position: 'absolute', left: 10, top: 10 }]} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.exitButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>إبدأ رحلة جديدة</Text>
      <Text style={styles.subtitle}>اختر لغة البرمجة وإطار العمل والأهداف التي تريد تحقيقها</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر لغة البرمجة</Text>
        <RNPickerSelect
          onValueChange={(value) => setLanguage(value as LanguageKey | '')}
          value={language}
          style={pickerSelectStyles}
          items={languages}
          placeholder={{ label: 'اختر لغة البرمجة', value: '' }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر إطار عمل</Text>
        <RNPickerSelect
          onValueChange={(value) => setFramework(value)}
          value={framework}
          style={pickerSelectStyles}
          items={availableFrameworks}
          placeholder={{ label: 'اختر إطار عمل', value: '' }}
          disabled={!language}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر هدفك</Text>
        <RNPickerSelect
          onValueChange={(value) => setGoal(value)}
          value={goal}
          style={pickerSelectStyles}
          items={goals}
          placeholder={{ label: 'اختر هدفك', value: '' }}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>اختر مستواك</Text>
        <RNPickerSelect
          onValueChange={(value) => setLevel(value)}
          value={level}
          style={pickerSelectStyles}
          items={levels}
          placeholder={{ label: 'اختر مستواك', value: '' }}
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.button,
          (!language || !framework || !goal || !level) && styles.buttonDisabled
        ]} 
        onPress={handleAddJourney}
        disabled={!language || !framework || !goal || !level}
      >
        <Text style={styles.buttonText}>إضافة رحلة جديدة</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    maxWidth: Platform.select({ web: 600, default: undefined }),
    alignSelf: Platform.select({ web: 'center', default: undefined }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  exitButton: {
    backgroundColor: '#4E7ED1',
    padding: 10,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E7ED1',
    textAlign: 'right',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#4E7ED1',
    marginBottom: 8,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4E7ED1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4E7ED1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    color: '#333',
    textAlign: 'right',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    color: '#333',
    textAlign: 'right',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputWeb: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    color: '#333',
    textAlign: 'right',
    paddingRight: 30,
    backgroundColor: '#fff',
    width: '100%',
  },
});
