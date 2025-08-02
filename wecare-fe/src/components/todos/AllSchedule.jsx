import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ICON_TYPES } from '../../constants/iconTypeConstants'; // 경로는 실제 구조에 맞게 조정
import { Theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import useTodoStore from '../../store/todoStore';
import { useDateFormat } from '../../hooks/useDateFormat';
import { completeRoutine, undoCompleteRoutine, getRoutine } from '../../providers/api';

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
  routineId, // routineId prop 추가
}) => {
  const [localScheduleData, setLocalScheduleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const {setTodoId} = useTodoStore();
  const { formatTimeRange,stringFormatTimeRange } = useDateFormat();
  const [selectedItemsTest, setSelectedItemsTest] = useState({});
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (routineId) {
      loadRoutineData();
    } else if (scheduleData.length > 0) {
      setLocalScheduleData(scheduleData);
      setLoading(false);
      // 초기 selectedItems 설정
      const initialSelectedItems = {};
      scheduleData.forEach(item => {
        const isCompleted = item.history !== null;
        if (isCompleted) {
          initialSelectedItems[item.id] = true;
        }
      });
      setSelectedItemsTest(initialSelectedItems);
      setSelectedItems(initialSelectedItems);
    }
  }, [routineId, scheduleData]);

  // 루틴 데이터 로드 함수
  const loadRoutineData = async () => {
    try {
      setLoading(true);
      console.log('🔍 AllSchedule loadRoutineData routineId: ', routineId);
      const response = await getRoutine(routineId);
      console.log('🔍 AllSchedule loadRoutineData response: ', response);
      
      if (response.status === 200) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log('🔍 AllSchedule loadRoutineData data: ', data);
        setLocalScheduleData(data);
        
        // selectedItems는 handleComplete에서 직접 관리하므로 여기서는 설정하지 않음
        console.log('🔍 AllSchedule 데이터 로드 완료');
      }
    } catch (error) {
      console.error('❌ AllSchedule loadRoutineData error: ', error);
    } finally {
      setLoading(false);
    }
  };
  
  // scheduleData가 변경될 때마다 로컬 상태를 서버 데이터와 동기화
  useEffect(() => {
    if (localScheduleData.length > 0) {
      // selectedItems는 handleComplete에서 직접 관리하므로 여기서는 설정하지 않음
      console.log('🔍 useEffect localScheduleData 업데이트 완료');
    }
  }, [localScheduleData]);

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
    console.log('🔍 handleComplete item: ', item);
    
    // 수행 된 것인지 판단
    console.log('🔍 handleComplete item.id: ', item.id);
    if(item.history === null) {
      console.log('🔍 루틴 완료 처리 시작');
      const response = await completeRoutine(item.id);
      console.log('🔍 handleComplete response: ', response);
      if(response.status === 200) {
        console.log('🔍 루틴 완료 성공 - 상태 직접 업데이트');
        // 상태 직접 업데이트
        setSelectedItems(prev => ({
          ...prev,
          [item.id]: true
        }));
        // 데이터 다시 로드
        await loadRoutineData();
      }
    } else {
      console.log('🔍 루틴 완료 해제 처리 시작');
      const response = await undoCompleteRoutine(item.history.id);
      console.log('🔍 handleComplete response: ', response);
      if(response.status === 200) {
        console.log('🔍 루틴 완료 해제 성공 - 상태 직접 업데이트');
        // 상태 직접 업데이트
        setSelectedItems(prev => {
          const newState = { ...prev };
          delete newState[item.id];
          return newState;
        });
        // 데이터 다시 로드
        await loadRoutineData();
      }
    }
  }

  // 스케줄 아이템 렌더링
  const renderScheduleItem = (item, index) => {
    console.log('🔍 renderScheduleItem item: ', item);
    // 완료여부 확인
    const isCompleted = item.history !== null ? true : false;
    console.log('🔍 AllSchedule isCompleted: ', isCompleted);
    
    // 체크박스 상태 결정 - 서버 데이터 우선, 로컬 상태는 보조
    // const isChecked = isCompleted || selectedItems[item.id] || false;
    const isChecked =  selectedItemsTest[item.id] || false;
    console.log('🔍 isChecked: ', isChecked, 'isCompleted: ', isCompleted, 'selectedItems[item.id]: ', selectedItems[item.id]);
    console.log('🔍 전체 selectedItems: ', selectedItems);

    // 아이콘 색상 확인 - type 또는 routineType 둘 다 지원
    const iconType = item.type || item.routineType;
    const iconBackgroundColor = getDefaultIconColor(iconType);
    
    // 마지막 아이템인지 확인 (활성화된 아이템 기준)
    const isLastItem = index === localScheduleData.length - 1;

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
            handleComplete(item);
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
      {console.log('🔍 AllSchedule 렌더링 - localScheduleData 길이: ', localScheduleData.length)}
      {console.log('🔍 AllSchedule 렌더링 - selectedItems: ', selectedItems)}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        localScheduleData.map((item, index) => renderScheduleItem(item, index))
      )}
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