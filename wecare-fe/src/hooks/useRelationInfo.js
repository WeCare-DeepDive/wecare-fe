import { useState, useEffect } from 'react';
import { getConnections, getPartnerInfo, getInviteCode, getUserInviteAccept, connectionsPatch, connectionsDeactivate } from '../providers/api';
import relationMock from '../mocks/getRelactionMock';
import usePartnerStore from '../store/partnerStore';
import { useAuthStore } from '../store/authStore';
/**
 * 연결된 상대방 정보 조회 훅
 * @param {string} mode - 조회 모드 
 * (partnerList: 연결된 상대방 정보 리스트,  get
 * invitationsGenerate: 초대코드 생성, get
 * invitationsAccept: 초대 수락 post
 * connections : 연결 정보 리스트 조회 get
 * connectionsPatch /{id} : 연결 정보 수정 patch
 * connectionsDeactivate  /{id}/deactivate : 연결 비활성화 patch
 * @param {number} partnerId - 상대방 ID (상세 조회 시 필요)
 * @param {boolean} useMock - 목업 데이터 사용 여부
 * @returns {Object} - 연결된 상대방 정보, 로딩 상태, 에러 정보
 */

export function useRelationInfo({ mode = 'connections', partnerId = null, useMock = false } = {}) {
  const [relationInfo, setRelationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPartnerInfo } = usePartnerStore();
  const {role} = useAuthStore();
  useEffect(() => {
    const fetchRelationInfo = async () => {
        // 연결된 상대방 정보 찾기
      setLoading(true);
      try { 
        let relationInfo;

        if(useMock) {
            // ✅ 목업 데이터 사용 분기
            switch(mode) {
                case 'partnerList':
                    relationInfo = await relationMock.getGuardianRelationMock();
                    break;
                case 'connections':
                    relationInfo = await relationMock.getDependentRelationMock();
                    setPartnerInfo({
                        id: role === 'GUARDIAN' ? relationInfo[0].dependentId : relationInfo[0].guardianId,
                        name: relationInfo[0].partnerName,
                    });
                    break;
                case 'invitationsGenerate':
                    // 초대코드 생성은 별도 훅에서 처리
                    relationInfo = { invitationCode: 'MOCK-INVITE-123' };
                    break;
                case 'invitationsAccept':
                    // 초대 수락은 별도 훅에서 처리
                    relationInfo = { success: true };
                    break;
                default:
                    throw new Error('알 수 없는 모드입니다.');
            }
        } 
        else {
            // ✅ 실제 API 호출
            switch(mode) {
                case 'partnerList': // 파트너 정보 조회(상대방 정보)
                    if(partnerId) {
                        relationInfo = await getPartnerInfo(partnerId);
                    } else {
                        setError(new Error('partnerId가 없습니다.'));
                        return;
                    }
                    break;
                case 'connections': // 연결 정보 리스트 조회 (본인이 연결한 정보)
                    relationInfo = await getConnections();
                    console.log('🔍 연결 정보 리스트 조회 성공! relationInfo', relationInfo);
                    if(relationInfo.length > 0) {
                        setPartnerInfo({
                            id: role === 'GUARDIAN' ? relationInfo[0].dependentId : relationInfo[0].guardianId,
                            name: relationInfo[0].partnerName,
                        });
                    }
                    break;
                case 'invitationsGenerate': // 초대코드 생성
                    console.log('🔍 초대코드 생성 시작:');
                    relationInfo = await getInviteCode();
                    break;
                case 'invitationsAccept': // 초대 수락
                    console.log('🔍 초대 수락 시작:');
                    relationInfo = await getUserInviteAccept(data);
                    break;
                case 'connectionsPatch': // 연결 정보 수정
                    relationInfo = await connectionsPatch();
                    break;
                case 'connectionsDeactivate': // 연결 비활성화
                    relationInfo = await connectionsDeactivate();
                    break;
                default:
                    throw new Error('알 수 없는 모드입니다.');
            }
        }
        console.log('🔍 API 응답 데이터! relationInfo', relationInfo);
        setRelationInfo(relationInfo);
      } catch (error) {
        console.error('🔍 API 호출 실패:', error);
        console.error('🔍 에러 상세 정보:', error.response?.data);
        console.error('🔍 에러 상태 코드:', error.response?.status);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelationInfo();
  }, [mode, partnerId, useMock]);

  return { relationInfo, loading, error };
}

