import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Theme } from '../../styles/theme';

dayjs.locale('ko');

const WeeklyCalendar = ({ onDateSelect, selectedDate = dayjs() }) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs(selectedDate));

  // 현재 주의 시작일 (일요일)
  const startOfWeek = currentWeek.startOf('week');

  // 주의 날짜들 생성
  const weekDates = Array.from({ length: 7 }, (_, index) => startOfWeek.add(index, 'day'));

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 숫자를 한글 서수로 변환하는 함수
  const getKoreanOrdinal = (num) => {
    const ordinals = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째'];
    return ordinals[num] || `${num}번째`;
  };

  // 월의 주차 계산 함수
  // 정확한 월별 주차 계산 함수
  const getWeekOfMonth = (targetDate) => {
    // 해당 주의 일요일부터 토요일까지의 7일
    const weekStart = targetDate.startOf('week'); // 일요일
    const weekEnd = targetDate.endOf('week'); // 토요일

    // 이번 주에서 각 월에 속하는 날짜 수를 계산
    const monthDayCounts = {};

    for (let i = 0; i < 7; i++) {
      const currentDay = weekStart.add(i, 'day');
      const monthKey = currentDay.format('YYYY-MM');

      if (!monthDayCounts[monthKey]) {
        monthDayCounts[monthKey] = 0;
      }
      monthDayCounts[monthKey]++;
    }

    // 가장 많은 날짜를 가진 월을 찾기
    let dominantMonth = null;
    let maxDays = 0;

    for (const [monthKey, dayCount] of Object.entries(monthDayCounts)) {
      if (dayCount > maxDays) {
        maxDays = dayCount;
        dominantMonth = monthKey;
      }
    }

    // 지배적인 월의 첫 번째 날
    const dominantMonthDate = dayjs(dominantMonth + '-01');
    const month = dominantMonthDate.month() + 1;

    // 해당 월의 모든 주를 계산
    const firstDayOfMonth = dominantMonthDate.startOf('month');
    const lastDayOfMonth = dominantMonthDate.endOf('month');

    // 해당 월이 포함된 모든 주를 찾기
    const weeks = [];
    let currentWeekStart = firstDayOfMonth.startOf('week');

    while (currentWeekStart.isBefore(lastDayOfMonth) || currentWeekStart.isSame(lastDayOfMonth, 'week')) {
      const currentWeekEnd = currentWeekStart.endOf('week');

      // 이 주가 해당 월에 속하는 날짜가 더 많은지 확인
      let monthDaysInWeek = 0;
      for (let i = 0; i < 7; i++) {
        const day = currentWeekStart.add(i, 'day');
        if (day.month() === dominantMonthDate.month() && day.year() === dominantMonthDate.year()) {
          monthDaysInWeek++;
        }
      }

      // 해당 월에 속하는 날이 4일 이상이면 그 월의 주로 간주
      if (monthDaysInWeek >= 4) {
        weeks.push(currentWeekStart);
      }

      currentWeekStart = currentWeekStart.add(1, 'week');
    }

    // 현재 주가 몇 번째 주인지 찾기
    let weekNumber = 1;
    for (let i = 0; i < weeks.length; i++) {
      if (weeks[i].isSame(weekStart, 'week')) {
        weekNumber = i + 1;
        break;
      }
    }

    return {
      month,
      week: weekNumber,
    };
  };

  // 헤더 텍스트 생성
  const getHeaderText = () => {
    // 현재 주의 중간 지점(수요일)을 기준으로 주차 계산
    const midWeek = startOfWeek.add(3, 'day');
    const { month, week } = getWeekOfMonth(midWeek);

    return `${month}월 ${getKoreanOrdinal(week)} 주`;
  };

  // 이전 주로 이동
  const goToPrevWeek = () => {
    setCurrentWeek(currentWeek.subtract(1, 'week'));
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.add(1, 'week'));
  };

  // 날짜 선택 핸들러
  const handleDatePress = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // 선택된 날짜인지 확인
  const isSelectedDate = (date) => {
    return dayjs(selectedDate).isSame(date, 'day');
  };

  // 오늘 날짜인지 확인
  const isToday = (date) => {
    return dayjs().isSame(date, 'day');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevWeek} style={styles.arrowButton}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>{getHeaderText()}</Text>

        <TouchableOpacity onPress={goToNextWeek} style={styles.arrowButton}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekdayHeader}>
        {weekdays.map((day, index) => (
          <View key={index} style={styles.weekdayContainer}>
            <Text
              style={[
                styles.weekdayText,
                index === 0 && styles.sundayText, // 일요일 빨간색
                index === 6 && styles.saturdayText, // 토요일 파란색
              ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 */}
      <View style={styles.datesContainer}>
        {weekDates.map((date, index) => {
          const selected = isSelectedDate(date);
          const today = isToday(date);

          return (
            <TouchableOpacity key={index} style={styles.dateContainer} onPress={() => handleDatePress(date)}>
              <View
                style={[
                  styles.dateCircle,
                  selected && styles.selectedDateCircle,
                  today && !selected && styles.todayDateCircle,
                ]}>
                <Text
                  style={[
                    styles.dateText,
                    selected && styles.selectedDateText,
                    today && !selected && styles.todayDateText,
                    index === 0 && !selected && styles.sundayDateText,
                    index === 6 && !selected && styles.saturdayDateText,
                  ]}>
                  {date.date()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.purple200,
    borderRadius: 16,
    padding: 16,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 8,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  sundayText: {
    color: '#ff4757',
  },
  saturdayText: {
    color: '#5352ed',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedDateCircle: {
    backgroundColor: '#5352ed',
  },
  todayDateCircle: {
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#5352ed',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedDateText: {
    color: 'white',
    fontWeight: '600',
  },
  todayDateText: {
    color: '#5352ed',
    fontWeight: '600',
  },
  sundayDateText: {
    color: '#ff4757',
  },
  saturdayDateText: {
    color: '#5352ed',
  },
});

export default WeeklyCalendar;

