/** TODO
 * 보호자 피보호자 글자 크기 다름!!
 * 할 일이 있는지 없는지 확인
 * 할일이 없을 때 화면 1
 * 할일이 있을 때 화면
 *  - 보호자의 경우
 *   - 체크 XXXX, 확인만 가능
 *   - 할 일 추가 버튼?이 있음 -> 클릭시 추가 화면 이동
 *  - 피보호자의 경우
 *    - 체크 가능
 *  - 공통
 *    - 대상의 할 일이 다 뜸
 *    - 오늘 날짜 기준 할 일이 보여야함
 *    - 화살표를 누르면 이전 날짜 혹은 다음 날짜 목록이 보여야 함
 *          - 만약 이때 데이터가 없으면 할일이 없을 때 화면이 뜨는걸로
 *    - 전체 할 일 보기 버튼을 누르면 전체 화면을 확인하는 페이지로 넘어가야 함
 *
 * 
 *  (NOBRIDGE) LOG  🔍 관계 정보 로드 완료: 
 * [
 * {
 * "id": 2, 
 * "active": true, 
 * "createdAt": null, 
 * "dependentId": 11,
 * "guardianId": 11, 
 * "relationshipType": "OTHER", 
 * "updatedAt": null
 * }
 * ]
 */

import { View } from 'react-native';
import NoDataCard from './NoDataCard';
import TodoCard from '../../../components/todos/TodoCard';
import { useRoutineInfo } from '../../../hooks/userRoutineInfo';
// import { useAuthStore } from '../../../store/authStore';

const PersonalCardScreen = ({ relation = [], role = 'GUARDIAN' }) => {
  // return todos.length === 0 ? <NoDataCard /> : <></>;
  // API 호출
  // const { role } = useAuthStore();
  // console.log('🔍 role', role);
  console.log('🔍 relation', relation);

  // console.log('🔍 user', user);
  // 할 일 목록 API 호출
  const { routine, loading: routineLoading, error: routineError } = useRoutineInfo({
    mode: "routines",
    targetId: relation[0].id,
    useMock: false,
  });
  
  console.log('🔍 PersonalCardScreen routine', routine);
  
  
  return (
    <View>
      {
        routine && routine.length === 0 || routine === null 
        ? <NoDataCard /> 
        : <TodoCard 
          routine={routine}
          role={role}
        />
      }
    </View>
  );
};

export default PersonalCardScreen;
