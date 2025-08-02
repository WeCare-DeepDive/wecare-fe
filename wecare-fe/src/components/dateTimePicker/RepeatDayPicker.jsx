import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Theme } from '../../styles/theme';

const RepeatDayPicker = ({ 
  onDaysSelect,
  isDependent = false,
  style 
}) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [hasSelectedDays, setHasSelectedDays] = useState(false);

  // 요일 데이터
  const daysData = [
      { key: 'NONE', label: '없음', shortLabel: '없음' },
      { key: 'SUN', label: '일요일', shortLabel: '일' },
      { key: 'MON', label: '월요일', shortLabel: '월' },
    { key: 'TUE', label: '화요일', shortLabel: '화' },
    { key: 'WED', label: '수요일', shortLabel: '수' },
    { key: 'THU', label: '목요일', shortLabel: '목' },
    { key: 'FRI', label: '금요일', shortLabel: '금' },
    { key: 'SAT', label: '토요일', shortLabel: '토' },
  ];

  const openDayPicker = () => {
    setIsPickerVisible(true);
  };

  const handleDayToggle = (dayKey) => {
    setSelectedDays(prevDays => {
      if (prevDays.includes(dayKey)) {
        // 이미 선택된 경우 제거
        return prevDays.filter(day => day !== dayKey);
      } else {
        // 선택되지 않은 경우 추가
        return [...prevDays, dayKey];
      }
    });
  };

  const handleConfirm = () => {
    setHasSelectedDays(selectedDays.length > 0);
    setIsPickerVisible(false);
    
    if (onDaysSelect) {
      onDaysSelect(selectedDays);
    }
  };

  const handleCancel = () => {
    setIsPickerVisible(false);
  };

  const getDisplayText = () => {
    if (!hasSelectedDays || selectedDays.length === 0) {
      return '반복 요일을 선택해 주세요';
    }

    // 모든 요일이 선택된 경우
    if (selectedDays.length === 7) {
      return '매일';
    }

    // 하나만 선택된 경우
    if (selectedDays.length === 1) {
      const dayData = daysData.find(day => day.key === selectedDays[0]);
      if(dayData.key === 'NONE') {
        return '없음';
      }
      return `${dayData.label}마다`;
    }

    // 여러 개 선택된 경우
    const sortedDays = selectedDays
      .map(dayKey => daysData.find(day => day.key === dayKey))
      .sort((a, b) => daysData.indexOf(a) - daysData.indexOf(b))
      .map(day => day.shortLabel);

    return sortedDays.join(', ');
  };

  const getDisplayTextColor = () => {
    return hasSelectedDays && selectedDays.length > 0 ? '#6B73FF' : '#999999';
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.repeatSelector}
        onPress={openDayPicker}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.repeatTitle, 
          { fontSize: isDependent ? 24 : 24 } // 기본 24로 설정
        ]}>
          반복
        </Text>
        <View style={styles.repeatValueContainer}>
          <Text style={[
            styles.repeatValue,
            { color: getDisplayTextColor() }
          ]}>
            {getDisplayText()}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={handleCancel}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>반복</Text>
              <TouchableOpacity onPress={handleConfirm} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 요일 선택 리스트 */}
            <View style={styles.daysContainer}>
              {daysData.map((day) => (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayItem,
                    selectedDays.includes(day.key) && styles.selectedDayItem
                  ]}
                  onPress={() => handleDayToggle(day.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDays.includes(day.key) && styles.selectedDayText
                  ]}>
                    {day.label}
                  </Text>
                  {selectedDays.includes(day.key) && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkMarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  repeatSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray5,
  },
  repeatTitle: {
    fontSize: 24, // 반복 글자 크기 24
    fontWeight: 'bold',
    color: Theme.Colors.labelsPrimary,
    flex: 1,
  },
  repeatValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  repeatValue: {
    fontSize: 18, // 반복 요일 텍스트 크기 18
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    color: Theme.Colors.gray900,
    fontWeight: '300',
  },
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
    maxHeight: '70%',
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
    color: Theme.Colors.gray900,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: Theme.Colors.gray900,
  },
  daysContainer: {
    paddingTop: 10,
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray5,
  },
  selectedDayItem: {
    backgroundColor: Theme.Colors.purple200,
  },
  dayText: {
    fontSize: 18,
    color: Theme.Colors.gray900,
    flex: 1,
  },
  selectedDayText: {
    color: Theme.Colors.purple500,
    fontWeight: '600',
  },
  checkMark: {
    width: 20,
    height: 20,
    backgroundColor: Theme.Colors.purple500,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: Theme.Colors.customWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RepeatDayPicker;