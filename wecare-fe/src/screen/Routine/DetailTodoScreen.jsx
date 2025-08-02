// 할 일 상세 화면
//TODO: 루틴 상세 화면 완성
// 롤에 따른 화면 다르게(헤더는 다르게 했음)
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useTodoStore from '../../store/todoStore';
import { useAuthStore } from '../../store/authStore';
import { useRoutineInfo } from '../../hooks/userRoutineInfo';
import AllSchedule from '../../components/todos/AllSchedule';

const DetailTodoScreen = () => {
    const {todoId} = useTodoStore();
    const {role} = useAuthStore(); 
    // 특정 상세 루틴 조회
    const { routine, loading: routineLoading, error: routineError, refetch } = useRoutineInfo({
        mode: "detail",
        routineId: todoId,
        useMock: false,
    });
    
    // 페이지가 포커스될 때마다 서버 호출
    useFocusEffect(
        React.useCallback(() => {
            console.log('🔍 DetailTodoScreen 화면 포커스 - 서버 호출');
            refetch();
        }, [refetch])
    );
    
    console.log('🔍 DetailTodoScreen routine: ', routine);
    console.log('🔍 DetailTodoScreen routine type: ', typeof routine);
  
    // Array가 아닌경우 배열로 변환 
    const scheduleData = Array.isArray(routine) ? routine : [routine];
    
  return (
    <View style={styles.container}>
      <AllSchedule 
        scheduleData={scheduleData}
        isBadge={true}
        isCard={true}
        role={role}
        // 디테일 보기인 경우 체크버튼 비활성화
        isDetail={true}
        onDataUpdate={refetch} // refetch 함수를 전달
      />
    </View>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default DetailTodoScreen;