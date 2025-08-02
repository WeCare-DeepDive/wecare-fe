import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Theme } from '../../styles/theme';

// 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

const DateSelector = ({ 
  onDateSelect, 
  initialDate = new Date(), 
  isDependent = false,
  style 
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  
  // initalDate가 변경될 때 내부 state update
  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // 요일 구하기
    const dayOfWeek = date.getDay();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[dayOfWeek];
    return `${year}.${month}.${day} (${dayName})`;
  };

  const handleDayPress = (day) => {
    const selectedDateObj = new Date(day.dateString);
    setSelectedDate(selectedDateObj);
    setIsCalendarVisible(false);
    
    if (onDateSelect) {
      onDateSelect(selectedDateObj);
    }
  };

  const openCalendar = () => {
    setIsCalendarVisible(true);
  };

  const closeCalendar = () => {
    setIsCalendarVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.dateSelector}
        onPress={openCalendar}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dateTitle,
          {fontSize: 24} 
        //   { fontSize: isDependent ? 24 : 20 }
        ]}>
          날짜
        </Text>
        <View style={styles.dateValueContainer}>
          <Text style={styles.dateValue}>
            { selectedDate ? formatDisplayDate(selectedDate) : "날짜를 선택해 주세요"}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCalendar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle]}>날짜 선택</Text>
              <TouchableOpacity onPress={closeCalendar}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Calendar
              current={formatDateString(selectedDate)}
              onDayPress={handleDayPress}
              markedDates={{
                [formatDateString(selectedDate)]: {
                  selected: true,
                  selectedColor: Theme.Colors.purple500
                }
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#4A90E2',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#4A90E2',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: Theme.Colors.purple500,
                selectedDotColor: '#ffffff',
                arrowColor: Theme.Colors.customBlack,
                monthTextColor: '#2d4150',
                indicatorColor: Theme.Colors.blueviolet,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
                textDayFontSize: 18,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 16
              }}
            />
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateTitle: {
    fontWeight: 'bold',
    color: Theme.Colors.labelsPrimary,
    flex: 1,
  },
  dateValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  dateValue: {
    fontSize: 18,
    color: Theme.Colors.purple500,
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    color: '#999999',
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  closeButton: {
    fontSize: 20,
    color: '#999999',
    padding: 5,
  },
});

export default DateSelector;