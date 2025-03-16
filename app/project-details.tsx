import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import HelpPopup from './components/help-popup';

export default function ProjectDetails() {
  const params = useLocalSearchParams<{ 
    projectNumber: string;
    language: string;
    environment: string;
  }>();
  const router = useRouter();
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    videoCapture: false,
    elementDetection: false,
    realTimeTracking: false,
    inventorySystem: false,
    userInterface: false,
  });

  const handleCheckboxChange = (key: keyof typeof checkedItems) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>منظم الرفوف الذكي</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Video Capture Section */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checkedItems.videoCapture}
                onValueChange={() => handleCheckboxChange('videoCapture')}
                color={checkedItems.videoCapture ? '#4E7ED1' : undefined}
                style={styles.checkbox}
              />
              <View style={styles.textContainer}>
                <Text style={styles.sectionTitle}>التقاط الفيديو ومعالجة الصور</Text>
                <Text style={styles.sectionDescription}>
                  تطوير واجهة برمجية باستخدام OpenCV لالتقاط الفيديو من الكاميرا في 
                  الوقت الفعلي. سيتم استخدام مكتبة OpenCV لمعالجة الإطارات المستخرجة من 
                  تدفق الفيديو، وتحليل المشاهد وإجراء المعالجة الأولية.
                </Text>
              </View>
            </View>
          </View>

          {/* Element Detection Section */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checkedItems.elementDetection}
                onValueChange={() => handleCheckboxChange('elementDetection')}
                color={checkedItems.elementDetection ? '#4E7ED1' : undefined}
                style={styles.checkbox}
              />
              <View style={styles.textContainer}>
                <Text style={styles.sectionTitle}>اكتشاف العناصر وتصنيفها</Text>
                <Text style={styles.sectionDescription}>
                  اكتشاف وتصنيف العناصر في كل إطار باستخدام HAAR Cascade و YOLO. 
                  التركيز على تحديد موقع العناصر على الرفوف وتصنيفها بدقة عالية. 
                  تطوير خوارزمية قادرة على تحديد وتصنيف المنتجات.
                </Text>
              </View>
            </View>
          </View>

          {/* Real-time Tracking Section */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checkedItems.realTimeTracking}
                onValueChange={() => handleCheckboxChange('realTimeTracking')}
                color={checkedItems.realTimeTracking ? '#4E7ED1' : undefined}
                style={styles.checkbox}
              />
              <View style={styles.textContainer}>
                <Text style={styles.sectionTitle}>تتبع العناصر في الوقت الحقيقي</Text>
                <Text style={styles.sectionDescription}>
                  تطوير واجهة برمجية تناسب قدرات OpenCV للتتبع في الوقت الفعلي مثل
                  Tracker/KCF و MedianFlow و CSRT. يجب أن تكون الخوارزمية قادرة على
                  تتبع العناصر حتى في حال تحركها.
                </Text>
              </View>
            </View>
          </View>

          {/* Inventory System Section */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checkedItems.inventorySystem}
                onValueChange={() => handleCheckboxChange('inventorySystem')}
                color={checkedItems.inventorySystem ? '#4E7ED1' : undefined}
                style={styles.checkbox}
              />
              <View style={styles.textContainer}>
                <Text style={styles.sectionTitle}>نظام إدارة المخزون</Text>
                <Text style={styles.sectionDescription}>
                  نظام CSV لتخزين بيانات كل عنصر مع معرف فريد. يشمل المعلومات اسم المنتج
                  والكمية وتاريخ آخر تحديث. نظام عرض تقارير لمراقبة تحركات المخزون
                  والتنبيهات.
                </Text>
              </View>
            </View>
          </View>

          {/* User Interface Section */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checkedItems.userInterface}
                onValueChange={() => handleCheckboxChange('userInterface')}
                color={checkedItems.userInterface ? '#4E7ED1' : undefined}
                style={styles.checkbox}
              />
              <View style={styles.textContainer}>
                <Text style={styles.sectionTitle}>واجهة المستخدم والتفاعل</Text>
                <Text style={styles.sectionDescription}>
                  تصميم واجهة تفاعلية تعرض الكاميرا المباشرة مع تحديث المخزون
                  بشكل مباشر. يتضمن العرض المباشر للمنتجات المكتشفة وإحصائيات عن
                  مستوى المخزون.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setIsHelpVisible(true)}
          >
            <Text style={styles.helpButtonText}>احصل على مساعدة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <HelpPopup 
        isVisible={isHelpVisible}
        onClose={() => setIsHelpVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4E7ED1',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4E7ED1',
    height: 60,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginRight: 16,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'right',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  helpButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4E7ED1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  helpButtonText: {
    color: '#4E7ED1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
