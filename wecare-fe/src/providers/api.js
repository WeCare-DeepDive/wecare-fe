//TODO
//- API 재 수정 필요
import { LOG_LEVEL} from '../config/environment';
import axiosInstance from './axiosInstance';

// 로그인 API
export const login = async (credentials) => {
  console.log('Login request payload:', credentials);
  const response = await axiosInstance.post('/auth/login', {
    username: credentials.userId,
    password: credentials.password,
  });
  return response.data;
};

// 회원가입 API
export const signup = async (userData) => {
  console.log('Signup request payload:', userData);
  const response = await axiosInstance.post('/auth/signup', {
    username: userData.username,
    password: userData.password,
    name: userData.name,
    gender: userData.gender,
    birthDate: userData.birthDate,
    role: userData.role,
  });
  return response.data;
};

// 기존 register API (호환성을 위해 유지)
export const register = async (userData) => {
  return signup(userData);
};

// 사용자 정보 조회 API
export const getUserInfo = async (partnerId) => {
  console.log('Fetching user info from /members/me');
  const response = await axiosInstance.get('/members/me', {
    useAuth: true,
  });
  console.log('Successfully fetched user info', response.data);
  return response.data;
};

// 내 연결 정보 리스트 조회 API 
export const getConnections = async () => {
  const response = await axiosInstance.get('/connections/details', {
    useAuth: true,
  });
  return response.data;
};

// 파트너 정보 조회 API
export const getPartnerInfo = async (partnerId) => {
  const response = await axiosInstance.get(`/members/partner/${partnerId}`, {
    useAuth: true,
  });
  return response.data;
}

// 토큰 갱신 API
export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

// 초대코드 생성
export const getInviteCode = async () => {
  // 초대코드 생성
  console.log('🔍 초대코드 생성 시작:');
  const response = await axiosInstance.get(
    `/invitations/generate`,
    {
      useAuth: true,
    }
  );
  if (LOG_LEVEL === 'debug') {
    console.log('🔍 초대코드 생성 성공:', response.data);
  }
  return response;
};

// 초대 코드 수락 요청
export const getUserInviteAccept = async (data) => {
  console.log('🔍 초대 코드 수락 요청:');  
  console.log('🔍 초대 코드 수락 요청:', data);  
  const response = await axiosInstance.post(`/invitations/accept`, data, {
    useAuth: true,
  });
  if (LOG_LEVEL === 'debug') {
    console.log('🔍 초대 코드 수락 성공:', response.data);
  }
  return response;
};

// 관계 연결 삭제
export const connectionsDeactivate = async (targetUserId) => {
  const response = await axiosInstance.patch(
    `/connections/${targetUserId}`,
    {},
    {
      useAuth: true,
    }
  );
  return response;
};

// 관계 연결 정보 수정
export const connectionsPatch = async (targetUserId, data) => {
  const response = await axiosInstance.patch(
    `/connections/${targetUserId}`,
    data,
    {},
    {
      useAuth: true,
    }
  );
  if (LOG_LEVEL === 'debug') {
    console.log('🔍 연결 재활성화 성공:', response.data);
  }
  return response;
};

/** 루틴 관련 API */
// 루틴 상세 조회
export const getRoutine = async (routineId) => {
  const response = await axiosInstance.get(
    `/routines/${routineId}`,
    {
      useAuth: true,
    }
  );
  if (LOG_LEVEL === 'debug') {
    console.log('호출 성공!: ', response.data);
  }
  return response.data;
};

// 특정 피보호자 루틴 조회
export const getGuardianRoutine = async (dependentId, date = '2025-08-03') => {
  const response = await axiosInstance.get(
    // `/routines/${dependentId}?date=${date}`,
    `/routines/2?date=${date}`,
    {
      useAuth: true,
    }
  );
  return response.data;
};

//TODO 루틴 생성, 업데이트, 삭제  수정 필요
// 루틴 생성
export const createRoutine = async (payload, dependentId) => {
  const response = await axiosInstance.post(`/routines/${dependentId}`, payload, { useAuth: true });
  return response.data;
};

// 루틴 업데이트
export const updateRoutine = async (payload, routineId) => {
  const response = await axiosInstance.patch(`/routines/${routineId}`, payload, {
    useAuth: true,
  });
  return response.data;
};


// 루틴 삭제
export const deleteRoutine = async (routineId) => {
  const response = await axiosInstance.delete(
    `/routines/${routineId}`,
    {},
    {
      useAuth: true,
    }
  );
  return response.data;
};

// 루틴 완료 /미완료 처리
export const updateRoutineStatus = async (routineId) => {
  const response = await axiosInstance.patch(`/routines/${routineId}/undo`, {}, { useAuth: true });
  return response.data;
};

// 루틴 메모 업데이트
export const updateRoutineMemo = async (routineId, memo) => {
  const response = await axiosInstance.patch(`/routines/${routineId}/memo`, { memo }, { useAuth: true });
  return response.data;
};

// MEMO : 히스토리를 루틴에서 분리해서 따로 
// 특정 루틴의 수행 기록 조회
export const getRoutineHistories = async (routineId) => {
  const response = await axiosInstance.get(`/routines/${routineId}/routine_histories`, { useAuth: true });
  return response.data;
};  

// 사용자 루틴 수행 기록 조회
export const getRoutineMemberHistories = async (memberId) => {
  const response = await axiosInstance.get(
    `routines/${memberId}/member_histories`,
    {
      useAuth: true,
    }
  );
  return response.data;
};

// 루틴 반복 데이터 조회
export const getRoutineRepeat = async (routineId) => {
  const response = await axiosInstance.get(
    `routines/${routineId}/repeat`,
    {
      useAuth: true,
    }
  );
  return response.data;
} 

// 루틴 수행 체크
export const completeRoutine = async (routineId) => {
  const response = await axiosInstance.post(`/routines/${routineId}/complete`, {}, { useAuth: true });
  return response.data;
}

// 루틴 수행 체크 취소
export const undoCompleteRoutine = async (routineId) => {
  const response = await axiosInstance.patch(`/routines/${routineId}/undo`, {}, { useAuth: true });
  return response.data;
}