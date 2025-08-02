import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AllSchedule from './AllSchedule';
import { Theme } from '../../styles/theme';
import DateHeader from '../dateTimePicker/DateHeader';
// import { useAuthStore } from '../../store/authStore';

const TodoCard = ({
  routine = [],
  role = 'GUARDIAN'
}) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const { role, user } = useAuthStore();

  // 날짜 변경 핸들러
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // 여기서 선택된 날짜에 따른 데이터를 fetch하거나 처리할 수 있습니다.
    console.log('Selected date:', date);
  };

  console.log('🔍 TodoCard routine: ', routine);

  return (
    <View style={styles.card}>
      {/* 날짜 */}
      <DateHeader onDateChange={handleDateChange} />
      

      {/* 할 일 목록 */}
      <View style={styles.todoListContainer }>
        {routine && routine.length > 0 &&
          <AllSchedule  
            scheduleData={routine}
            onToggleItem={() => {}}
            isBadge={false}
            isCard={false}
            role={role}
            />
          
        }
      </View> 

      {/* 할 일 추가 */}
      {
      role === 'GUARDIAN' && (
        <TouchableOpacity style={styles.addRow} onPress={() =>
          navigation.navigate('AddTodoForm')
        }>
          <Text style={styles.plus}>＋</Text>
          <Text style={styles.addText}>할 일 추가하기</Text>
        </TouchableOpacity>
      )
      }

      {/* 전체 할 일 보기 */}
      <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate('AllTodoScreen')}>
        <Text style={styles.viewAllText}>전체 할 일 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.Colors.customWhite,
    // borderRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    // margin: 16,
    shadowColor: Theme.Colors.customBlack,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  arrow: {
    fontSize: 18,
    color: Theme.Colors.gray900 || '#aaa',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  todoText: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  todoTime: {
    fontSize: 12,
    color: Theme.Colors.gray900 || '#888',
    marginTop: 2,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  plus: {
    fontSize: 16,
    backgroundColor: Theme.Colors.gray200 || '#e5e7eb',
    color: Theme.Colors.gray600 || '#6b7280',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  addText: {
    fontSize: 16,
    color: Theme.Colors.gray600 || '#6b7280',
    fontWeight: '400',
  },
  viewAllButton: {
    marginTop: 20,
    backgroundColor: Theme.Colors.purple500 || '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: Theme.Colors.customWhite || '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  todoList: {
    backgroundColor: Theme.Colors.customWhite,
    marginTop: 16,
  },
  todoListContainer: {
    backgroundColor: Theme.Colors.customWhite,
    marginTop: 16,
    width: '100%',
  },
});

export default TodoCard;
