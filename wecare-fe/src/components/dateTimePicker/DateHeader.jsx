// components/DateHeader.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@styles/theme';
import IconDateTomorrow from '@assets/Iconsvg/Idea/IconDateTomorrow.svg';
import IconDateYesterday from '@assets/Iconsvg/Idea/IconDateYesterday.svg';

const DateHeader = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 날짜 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onDateChange && onDateChange(selectedDate);
  }, [selectedDate, onDateChange]);

  // 날짜 포맷팅
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 시간 포맷팅
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${period} ${displayHours}:${minutes}`;
  };

  // 이전 날짜로 변경
  const goToPreviousDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  // 다음 날짜로 변경
  const goToNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={goToPreviousDate} style={styles.arrowButton}>
        <IconDateYesterday style={styles.arrow} />
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        {/* <Text style={styles.time}>{formatTime(currentTime)}</Text> */}
      </View>
      
      <TouchableOpacity onPress={goToNextDate} style={styles.arrowButton}>
        <IconDateTomorrow style={styles.arrow} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dateContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  date: {
    fontSize: 20,
    fontWeight: '600',
    color: Theme.Colors.labelsPrimary,
  },
  time: {
    fontSize: 18,
    color: Theme.Colors.gray800,
    marginTop: 2,
  },
  arrowButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    color: Theme.Colors.gray900,
  },
});

export default DateHeader;