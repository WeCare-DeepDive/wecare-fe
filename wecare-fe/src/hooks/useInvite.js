import { useState, useCallback } from 'react';
import { getInviteCode, getUserInviteAccept, connectionsDeactivate, connectionsPatch } from '../providers/api';

/**
 * 초대 관련 기능을 제공하는 훅
 * @param {Object} options - 옵션 객체
 * @param {boolean} options.useMock - 목업 데이터 사용 여부
 * @returns {Object} 초대 관련 상태와 함수들
 */
export const useInvite = ({ useMock = false } = {}) => {
  const [inviteCode, setInviteCode] = useState(null);
  const [inviteCodeError, setInviteCodeError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // 초대코드 불러오기
  const fetchInviteCode = useCallback(async () => {
    setIsLoading(true);
    setInviteCodeError(null);
    
    try {
      console.log('🔍 초대코드 불러오기 시작: useInvite');
      
      if (useMock) {
        // 목업 데이터 사용
        console.log('🔍 목업 데이터 사용');
        const mockInviteCode = 'MOCK-1234-5678';
        setInviteCode(mockInviteCode);
        return;
      } else {
        const response = await getInviteCode();
        console.log('초대코드 불러오기 성공!!!!!!!!!!');
        console.log('🔍 초대코드 불러오기 성공:', response.data?.invitationCode);
        setInviteCodeError(null);
        setInviteCode(response.data.invitationCode);
      }
    } catch (error) {
      console.error('🔍 초대코드 불러오기 실패:', error);
      setInviteCodeError(error);
    } finally {
      setIsLoading(false);
    }
  }, [useMock]);

  // 초대 코드 수락
  const fetchInviteAccept = useCallback(async (data) => {
    setIsLoading(true);
    setInviteCodeError(null);
    setIsSuccess(false);
    
    try {
      console.log('🔍 초대 코드 수락 시작: useInvite');
      
      if (useMock) {
        // 목업 데이터 사용
        console.log('🔍 목업 데이터 사용 - 초대 코드 수락');
        setIsSuccess(true);
        return;
      }
      
      const response = await getUserInviteAccept(data);
      console.log('🔍 초대 코드 수락 성공:', response);
      setInviteCodeError(null);
      setInviteCode(response.data);
      setIsSuccess(true);
    } catch (error) {
      console.error('🔍 초대 코드 수락 실패:', error);
      setInviteCodeError(error);
    } finally {
      setIsLoading(false);
    }
  }, [useMock]);

  // 연결 삭제
  const fetchConnectionsDelete = useCallback(async (targetUserId) => {
    setIsLoading(true);
    setInviteCodeError(null);
    
    try {
      console.log('🔍 연결 삭제 시작: useInvite');
      const response = await connectionsDeactivate(targetUserId);
      console.log('🔍 연결 삭제 성공:', response);
    } catch (error) {
      console.error('🔍 연결 삭제 실패:', error);
      setInviteCodeError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 연결 정보 수정
  const fetchConnectionsPatch = useCallback(async (targetUserId, data) => {
    setIsLoading(true);
    setInviteCodeError(null);
    
    try {
      console.log('🔍 연결 정보 수정 시작: useInvite');
      const response = await connectionsPatch(targetUserId, data);
      console.log('🔍 연결 정보 수정 성공:', response);
    } catch (error) {
      console.error('🔍 연결 정보 수정 실패:', error);
      setInviteCodeError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 상태 초기화
  const resetInviteState = useCallback(() => {
    setInviteCode(null);
    setInviteCodeError(null);
    setIsLoading(false);
    setIsSuccess(false);
  }, []);

  return {
    // 상태
    inviteCode,
    inviteCodeError,
    isLoading,
    isSuccess,
    
    // 함수들
    fetchInviteCode,
    fetchInviteAccept,
    fetchConnectionsDelete,
    fetchConnectionsPatch,
    resetInviteState,
  };
}; 