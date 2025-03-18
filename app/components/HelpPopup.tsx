import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SkeletonLoader from './SkeletonLoader';

interface HelpPopupProps {
  isVisible: boolean;
  onClose: () => void;
  isLoading: boolean;
  helpText: string;
}

export default function HelpPopup({
  isVisible,
  onClose,
  isLoading,
  helpText,
}: HelpPopupProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>مساعدة</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4E7ED1" />
                <Text style={styles.loadingText}>جاري توليد المساعدة...</Text>
                <View style={styles.skeletonContainer}>
                  <SkeletonLoader width="100%" height={16} style={styles.skeleton} />
                  <SkeletonLoader width="90%" height={16} style={styles.skeleton} />
                  <SkeletonLoader width="80%" height={16} style={styles.skeleton} />
                  <SkeletonLoader width="85%" height={16} style={styles.skeleton} />
                </View>
              </View>
            ) : (
              <Text style={styles.helpText}>{helpText}</Text>
            )}
          </View>
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
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  skeletonContainer: {
    width: '100%',
    marginTop: 20,
  },
  skeleton: {
    marginBottom: 12,
  },
  helpText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'right',
  },
}); 