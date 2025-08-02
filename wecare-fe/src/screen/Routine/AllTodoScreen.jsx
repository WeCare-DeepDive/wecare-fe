import { SafeAreaView, ScrollView, View } from 'react-native';
import WeeklyCalendar from '../../components/Calendar/WeeklyCalender';
import AllSchedule from '../../components/todos/AllSchedule';
import AddFloatingButton from '../../components/buttons/AddFloatingButton';
import { useNavigation } from '@react-navigation/native';
import { useRoutineInfo } from '../../hooks/userRoutineInfo';
import { useAuthStore } from '../../store/authStore';

const AllTodoScreen = () => {
  const navigation = useNavigation();

  // 테스트 할 일 데이터 추가
  // 할 일 목록 API 호출
  const { routine, loading: routineLoading, error: routineError } = useRoutineInfo({
    mode: "routines",
    routineId: 1, //임시로 박아둠
    useMock: false,
  });
  const { role } = useAuthStore();
  console.log('🔍 role', role);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 , height: '100%'}}>
        <WeeklyCalendar />
        {routine && <AllSchedule 
          scheduleData={routine}
          isBadge={true}
          isCard={true}
          role={role}
        />}
      </ScrollView>
        {role === 'GUARDIAN' && <AddFloatingButton onPress={() => navigation.navigate('AddTodoForm')} />}
    </SafeAreaView>
  );
};

export default AllTodoScreen;
