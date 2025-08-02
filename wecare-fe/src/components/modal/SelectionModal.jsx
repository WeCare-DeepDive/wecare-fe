import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Theme } from '../../styles/theme';

const SelectionModal = ({ 
  visible, 
  onClose, 
  title, 
  options = [], 
  selectedValue, 
  onSelect 
}) => {
  const handleSelect = (value) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 옵션 리스트 */}
          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selectedValue === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <View style={styles.checkMark}>
                    <Text style={styles.checkMarkText}>|</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.Colors.labelsPrimary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: Theme.Colors.gray900,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray5,
  },
  selectedOption: {
    backgroundColor: Theme.Colors.purple200,
  },
  optionText: {
    fontSize: 16,
    color: Theme.Colors.labelsPrimary,
    flex: 1,
  },
  selectedOptionText: {
    color: Theme.Colors.purple500,
    fontWeight: '600',
  },
  checkMark: {
    width: 2,
    height: 20,
    backgroundColor: Theme.Colors.purple500,
    borderRadius: 1,
  },
  checkMarkText: {
    color: Theme.Colors.purple500,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SelectionModal;