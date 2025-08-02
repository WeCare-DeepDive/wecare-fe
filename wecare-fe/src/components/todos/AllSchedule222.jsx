import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ICON_TYPES } from '../../constants/iconTypeConstants'; // 경로는 실제 구조에 맞게 조정
import { Theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import useTodoStore from '../../store/todoStore';
import { useDateFormat } from '../../hooks/useDateFormat';
import { completeRoutine, undoCompleteRoutine } from '../../providers/api';

// TODO: 루틴 상세 화면 완성
//- 여기서 필요한 데이터
//- 모든 데이터 정보
//- 루틴 수행 여부
const AllSchedule = ({ 
  scheduleData=[], 
  onToggleItem, 
  isBadge = false,
  isCard = true,
  role,
  isDetail = false,
  onDataUpdate, // 데이터 업데이트 콜백 추가
}) => {
  console.log('🔍 AllSchedule scheduleData: ', scheduleData);
  const [selectedItems, setSelectedItems] = useState({});
  const navigation = useNavigation();
  const {setTodoId} = useTodoStore();
  const { formatTimeRange,stringFormatTimeRange } = useDateFormat();
  
  // scheduleData가 변경될 때마다 로컬 상태를 서버 데이터와 동기화
  useEffect(() => {
    const newSelectedItems = {};
    scheduleData.forEach(item => {
      // 서버 데이터에서 완료 여부 확인
      const isCompleted = item.history !== null;
      if (isCompleted) {
        newSelectedItems[item.id] = true;
      }
    });
    setSelectedItems(newSelectedItems);
  }, [scheduleData]);

  const toggleItem = (itemKey) => {
    const newSelectedItems = {
      ...selectedItems,
      [itemKey]: !selectedItems[itemKey],
    };
    
    setSelectedItems(newSelectedItems);
    
    if (onToggleItem) {
      onToggleItem(itemKey, newSelectedItems[itemKey], newSelectedItems);
    }
  };

  // constants에서 아이콘 가져오기
  const renderIcon = (iconType) => {
    const iconConfig = ICON_TYPES[iconType];
    
    if (!iconConfig) {
      // 기본 아이콘 또는 에러 처리
      const DefaultIcon = ICON_TYPES['CUSTOM'].Icon;
      return <DefaultIcon style={styles.iconText} />;
    }
    
    const IconComponent = iconConfig.Icon;
    return <IconComponent style={styles.iconText} />;
  };

  // 기본 색상도 constants에서 가져오기
  const getDefaultIconColor = (iconType) => {
    return ICON_TYPES[iconType]?.defaultColor || '#ffd700';
  };

  // // 활성화된 아이템들만 필터링 - 새로운 데이터 형태에 맞춰 추가
  // const enabledItems = scheduleData.filter(item => {
  //   // 새로운 데이터 형태: alert.isActive 확인
  //   if (item.alert && item.alert.isActive !== undefined) {
  //     return item.alert.isActive;
  //   }
  //   // 기존 데이터 형태: isEnabled 확인
  //   return item.isEnabled !== false;
  // });

  // 완료 처리 함수
  const handleComplete = async (item) => {
    toggleItem(item.id);
  }   

  // 스케줄 아이템 렌더링
  const renderScheduleItem = (item, index) => {
    console.log('🔍 renderScheduleItem item: ', item);
    // 완료여부 확인
    const isCompleted = item.history !== null ? true : false;
    console.log('🔍 AllSchedule isCompleted: ', isCompleted);
    
    // 체크박스 상태 결정 - 서버 데이터 우선, 로컬 상태는 보조
    // const isChecked = isCompleted || selectedItems[item.id] || false;
    const isChecked = selectedItems[item.id] || false;
    console.log('🔍 isChecked: ', isChecked, 'isCompleted: ', isCompleted, 'selectedItems[item.id]: ', selectedItems[item.id]);

    // 아이콘 색상 확인 - type 또는 routineType 둘 다 지원
    const iconType = item.type || item.routineType;
    const iconBackgroundColor = getDefaultIconColor(iconType);
    
    // 마지막 아이템인지 확인 (활성화된 아이템 기준)
    const isLastItem = index === scheduleData.length - 1;

    // 스타일 결정 - completedItem 스타일 제거
    const itemStyle = [
      isCard ? styles.scheduleItemCard : styles.scheduleItemBorder,
      // 완료된 아이템의 배경색 변경 제거
      // 카드가 아니고 마지막 아이템이 아닐 때만 구분선 추가
      !isCard && !isLastItem && styles.borderBottomStyle
    ];

    return (
      <View key={item.id} style={itemStyle}>
        <TouchableOpacity 
        style={styles.leftSection}
        onPress={() => {
          setTodoId(item.id);
          // navigation.navigate('DetailTodoScreen');
        }}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            // 완료된 아이템의 아이콘 배경색 변경 제거
            { backgroundColor: iconBackgroundColor },
          ]}
        >
          {renderIcon(iconType)}
        </View>

        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, isCompleted && styles.completedTitle]}>
            {item.title}
          </Text>
          <Text style={[styles.itemTime, isCompleted && styles.completedTime]}>
            {stringFormatTimeRange(item.startTime, item.endTime)}
          </Text>
          {isBadge && (
            <Text style={[styles.itemStatus, isCompleted && styles.completedStatus]}>
              {isChecked ? '완료' : '미완료'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => {
            // handleComplete(item);
            toggleItem(item.id);
          }}
        >
          <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {scheduleData.map((item, index) => renderScheduleItem(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.customWhite,
    padding: 10,
  },
  scheduleItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleItemBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  // 구분선 스타일 (카드가 아닐 때만 적용)
  borderBottomStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray200 || '#e5e7eb',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Theme.FontSize.size_20,
    fontWeight: '600',
    color: Theme.Colors.labelsPrimary,
    marginBottom: 4,
  },
  completedTitle: {
    color: '#666',
  },
  itemTime: {
    fontSize: Theme.FontSize.size_18,
    color: Theme.Colors.colorDimgray,
    marginBottom: 2,
  },
  completedTime: {
    color: '#999',
  },
  itemStatus: {
    fontSize: 12,
    color: '#999',
  },
  completedStatus: {
    color: Theme.Colors.purple500 || '#6366f1',
    fontWeight: '500',
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Theme.Colors.purple500 || '#6366f1',
    borderColor: Theme.Colors.purple500 || '#6366f1',
  },
  checkmark: {
    color: Theme.Colors.customWhite || 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AllSchedule;