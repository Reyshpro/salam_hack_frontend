import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface InfoPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function InfoPopup({ isVisible, onClose }: InfoPopupProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>مساعدة</Text>
          </View>
          
          <View style={styles.decorativeLine} />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              لتحقيق اكتشاف دقيق وفعال للعناصر على الرفوف باستخدام OpenCV في ++C، يفضل استخدام خوارزميات قوية مثل YOLO أو HAAR Cascade حسب متطلبات المشروع. يعد YOLO خيارا ممتازا لقدرته على التعرف على عناصر متعددة بسرعة ودقة عالية، بينما HAAR Cascade يتميز بالبساطة وسهولة التنفيذ لكنه أقل كفاءة في الحالات المعقدة. يمكن استخدام نموذج جاهز مثل YOLOv3 أو YOLOv4، أو تدريب نموذج مخصص باستخدام بيانات خاصة بالمشروع. لضمان أداء جيد، ينصح بجمع بيانات متنوعة تحتوي على صور للعناصر بزوايا مختلفة وإضاءة متغيرة ثم وسمها باستخدام أدوات مثل LabelImg أثناء البرمجة. يمكن استخدام دالة (cv::dnn::readNetFromDarknet) لتحميل النموذج، مع ضبط معايير مثل "عتبة الثقة" لتصفية الاكتشافات الضعيفة.
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={onClose}
          >
            <Text style={styles.submitButtonText}>تمام فضلت</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E7ED1',
    textAlign: 'center',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  decorativeLine: {
    height: 2,
    backgroundColor: '#eee',
    marginBottom: 24,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    lineHeight: 22,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  submitButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#4E7ED1',
    shadowColor: '#4E7ED1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
});
