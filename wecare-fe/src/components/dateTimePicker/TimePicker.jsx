import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Theme } from '../../styles/theme';

const TimePicker = ({ 
  onTimeSelect,
  isDependent = false,
  style 
}) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start'); // 'start' or 'end'
  const [hasSelectedTime, setHasSelectedTime] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(new Date()); // 임시 시작 시간
  const [tempEndTime, setTempEndTime] = useState(new Date()); // 임시 종료 시간

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = date.getHours() < 12 ? '오전' : '오후';
    const displayHours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? 12 : date.getHours();
    return `${period} ${String(displayHours).padStart(2, '0')}:${minutes}`;
  };

  const openTimePicker = () => {
    setCurrentPicker('start');
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setIsPickerVisible(true);
  };

  // 시간 변경 핸들러 (실시간으로 임시 상태 업데이트)
  const handleTimeChange = (selectedDate) => {
    if (currentPicker === 'start') {
      setTempStartTime(selectedDate);
    } else {
      setTempEndTime(selectedDate);
    }
  };

  // 시작/종료 시간 버튼 클릭 핸들러
  const handleTimeButtonPress = (pickerType) => {
    setCurrentPicker(pickerType);
  };

  // X 버튼 클릭 시 시간 적용
  const handleCancel = () => {
    setStartTime(tempStartTime);
    setEndTime(tempEndTime);
    setHasSelectedTime(true);
    setIsPickerVisible(false);
    
    if (onTimeSelect) {
      onTimeSelect({ startTime: tempStartTime, endTime: tempEndTime });
    }
  };

  // 모달을 닫기만 하는 함수 (시간 적용 안함)
  const handleModalClose = () => {
    setIsPickerVisible(false);
  };

  const getDisplayText = () => {
    if (!hasSelectedTime) {
      return '시작 시간 ~ 종료 시간';
    }
    return `${formatTime(startTime)} ~ ${formatTime(endTime)}`;
  };

  const getDisplayTextColor = () => {
    return hasSelectedTime ? '#6B73FF' : '#999999';
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.timeSelector}
        onPress={openTimePicker}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.timeTitle, 
          {fontSize: 24}
        //   { fontSize: isDependent ? 24 : 20 }
        ]}>
          시간
        </Text>
        <View style={styles.timeValueContainer}>
          <Text style={[
            styles.timeValue,
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
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={handleModalClose}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>시작 시간</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 시간 표시 버튼들 - 클릭 가능하도록 수정 */}
            <View style={styles.timeButtonsContainer}>
              <TouchableOpacity 
                style={[
                  styles.timeButton,
                  currentPicker === 'start' && styles.activeTimeButton
                ]}
                onPress={() => handleTimeButtonPress('start')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.timeButtonText,
                  currentPicker === 'start' && styles.activeTimeButtonText
                ]}>
                  {formatTime(tempStartTime)}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.timeSeparator}>~</Text>
              
              <TouchableOpacity 
                style={[
                  styles.timeButton,
                  currentPicker === 'end' && styles.activeTimeButton
                ]}
                onPress={() => handleTimeButtonPress('end')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.timeButtonText,
                  currentPicker === 'end' && styles.activeTimeButtonText
                ]}>
                  {formatTime(tempEndTime)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* DatePicker */}
            <View style={styles.pickerContainer}>
              <DatePicker
                date={currentPicker === 'start' ? tempStartTime : tempEndTime}
                mode="time"
                onDateChange={handleTimeChange}
                style={styles.datePicker}
                locale="ko"
                is24hourSource="device"
              />
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
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  timeTitle: {
    fontWeight: 'bold',
    color: Theme.Colors.labelsPrimary,
    flex: 1,
  },
  timeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  timeValue: {
    fontSize: 18,
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    color: Theme.Colors.purple500,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999999',
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  timeButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  activeTimeButton: {
    backgroundColor: '#6B73FF',
  },
  timeButtonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  activeTimeButtonText: {
    color: '#FFFFFF',
  },
  timeSeparator: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  pickerContainer: {
    alignItems: 'center',
  },
  datePicker: {
    height: 200,
  },
});

export default TimePicker;