import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InfoPopup from './info-popup';

interface HelpPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function HelpPopup({ isVisible, onClose }: HelpPopupProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = () => {
    setShowInfo(true);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
    setSelectedOption('');
    onClose();
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible && !showInfo}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.title}>مساعدة</Text>
            <Text style={styles.subtitle}>كيف يمكننا مساعدتك</Text>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedOption === 'current' && styles.selectedOption
              ]}
              onPress={() => setSelectedOption('current')}
            >
              <MaterialIcons 
                name={selectedOption === 'current' ? 'radio-button-checked' : 'radio-button-unchecked'} 
                size={24} 
                color={selectedOption === 'current' ? '#4E7ED1' : '#666'} 
                style={styles.radioIcon}
              />
              <Text style={[
                styles.optionText,
                selectedOption === 'current' && styles.selectedOptionText
              ]}>أريد مساعدة بسيطة في المهمة الحالية</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                selectedOption ? styles.submitButtonActive : styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!selectedOption}
            >
              <Text style={[
                styles.submitButtonText,
                !selectedOption && styles.submitButtonTextDisabled
              ]}>اطلب</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <InfoPopup 
        isVisible={showInfo}
        onClose={handleInfoClose}
      />
    </>
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
    padding: 24,
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
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E7ED1',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
    lineHeight: 22,
  },
  optionButton: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedOption: {
    borderColor: '#4E7ED1',
    backgroundColor: '#F5F8FF',
  },
  radioIcon: {
    marginLeft: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    flex: 1,
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  submitButtonActive: {
    backgroundColor: '#4E7ED1',
    shadowColor: '#4E7ED1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({ web: 'system-ui', default: undefined }),
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
});
