import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SelectionModal from './SelectionModal';
import { Theme } from '../../styles/theme';

const NotificationSettings = ({ 
  onSettingsChange,
  isDependent = false,
  style 
}) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(null);
  const [notificationSound, setNotificationSound] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'time' or 'sound'

  // 알림 시간 옵션
  //NONE, ON_START_TIME, ON_END_TIME, EVERY_10_MINUTES, EVERY_30_MINUTES, EVERY_HOUR
  const timeOptions = [
    { label: '시작 시간', value: 'ON_START_TIME' },
    { label: '종료 시간', value: 'ON_END_TIME' },
    { label: '10분마다', value: 'EVERY_10_MINUTES' },
    { label: '30분마다', value: 'EVERY_30_MINUTES' },
    { label: '1시간마다', value: 'EVERY_HOUR' },
  ];

  // 사운드 옵션
  //DEFAULT_SOUND, SILENT, VIBRATION, VOICE_MESSAGE
  const soundOptions = [
    { label: '기본 알림음', value: 'DEFAULT_SOUND' },
    { label: '진동', value: 'VIBRATION' },
    { label: '무음', value: 'SILENT' }, 
    { label: '음성 메시지', value: 'VOICE_MESSAGE' },
  ];

  const handleToggle = () => {
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);
    
    if (!newState) {
      // 알림을 끄면 모든 데이터를 null로 설정
      setNotificationTime(null);
      setNotificationSound(null);
      
      if (onSettingsChange) {
        onSettingsChange({
          enabled: false,
          time: null,
          sound: null
        });
      }
    } else {
      if (onSettingsChange) {
        onSettingsChange({
          enabled: true,
          time: notificationTime,
          sound: notificationSound
        });
      }
    }
  };

  const openTimeModal = () => {
    if (!isNotificationEnabled) return;
    setModalType('time');
    setModalVisible(true);
  };

  const openSoundModal = () => {
    if (!isNotificationEnabled) return;
    setModalType('sound');
    setModalVisible(true);
  };

  const handleTimeSelect = (value) => {
    setNotificationTime(value);
    if (onSettingsChange) {
      onSettingsChange({
        enabled: isNotificationEnabled,
        time: value,
        sound: notificationSound
      });
    }
  };

  const handleSoundSelect = (value) => {
    setNotificationSound(value);
    if (onSettingsChange) {
      onSettingsChange({
        enabled: isNotificationEnabled,
        time: notificationTime,
        sound: value
      });
    }
  };

  const getTimeDisplayText = () => {
    if (!isNotificationEnabled || !notificationTime) {
      return '알림 시간을 선택해 주세요';
    }
    const timeOption = timeOptions.find(option => option.value === notificationTime);
    return timeOption ? timeOption.label : '알림 시간을 선택해 주세요';
  };

  const getSoundDisplayText = () => {
    if (!isNotificationEnabled || !notificationSound) {
      return '사운드를 선택해 주세요';
    }
    const soundOption = soundOptions.find(option => option.value === notificationSound);
    return soundOption ? soundOption.label : '사운드를 선택해 주세요';
  };

  const getTextColor = (hasValue) => {
    if (!isNotificationEnabled) return '#CCCCCC';
    return hasValue ? '#6B73FF' : '#999999';
  };

  return (
    <View style={[styles.container, style]}>
      {/* 알림 토글 */}
      <View style={styles.notificationToggle}>
        <Text style={[
          styles.notificationTitle,
          { fontSize: isDependent ? 28 : 24 }
        ]}>
          알림
        </Text>
        <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
          {/* 여기에 토글 SVG 컴포넌트를 넣으세요 */}
          <View style={[
            styles.toggleButton,
            { backgroundColor: isNotificationEnabled ? Theme.Colors.purple500 : Theme.Colors.gray5 }
          ]}>
            <View style={[
              styles.toggleCircle,
              { 
                transform: [{ 
                  translateX: isNotificationEnabled ? 24 : 2 
                }] 
              }
            ]} />
          </View>
          {/* SVG 컴포넌트 사용 시 위의 View들을 대체하세요
          <ToggleSvgComponent 
            isEnabled={isNotificationEnabled}
            width={50}
            height={25}
          />
          */}
        </TouchableOpacity>
      </View>

      {/* 알림이 켜져 있을 때만 표시 */}
      {isNotificationEnabled && (
        <>
          {/* 알림 시간 */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={openTimeModal}
            activeOpacity={0.7}
          >
            <Text style={styles.settingLabel}>알림 시간</Text>
            <View style={styles.settingValueContainer}>
              <Text style={[
                styles.settingValue,
                { color: getTextColor(notificationTime) }
              ]}>
                {getTimeDisplayText()}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* 사운드 */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={openSoundModal}
            activeOpacity={0.7}
          >
            <Text style={styles.settingLabel}>사운드</Text>
            <View style={styles.settingValueContainer}>
              <Text style={[
                styles.settingValue,
                { color: getTextColor(notificationSound) }
              ]}>
                {getSoundDisplayText()}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* 선택 모달 */}
      <SelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalType === 'time' ? '알림 시간' : '사운드'}
        options={modalType === 'time' ? timeOptions : soundOptions}
        selectedValue={modalType === 'time' ? notificationTime : notificationSound}
        onSelect={modalType === 'time' ? handleTimeSelect : handleSoundSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  notificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  notificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  // 임시 토글 버튼 스타일 (SVG로 대체 예정)
  toggleButton: {
    width: 50,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleCircle: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  settingLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    color: '#999999',
    fontWeight: '300',
  },
});

export default NotificationSettings;