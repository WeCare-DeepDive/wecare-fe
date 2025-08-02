// hooks/useUserInfo.js
import { useState, useEffect } from 'react';
import { getUserInfo } from '../providers/api';
import { getUserInfoMock } from '../mocks/getUserInfoMock';

export default function useUserInfo({ useMock = false } = {}) {
  const [user, setUser] = useState(null);
  const [isDependent, setIsDependent] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = useMock
          ? await getUserInfoMock()
          : await getUserInfo();

        if (!userInfo) throw new Error('유저 정보를 불러올 수 없습니다.');

        setUser(userInfo);
        setIsDependent(userInfo.role === 'DEPENDENT');
      } catch (err) {
        console.error('❌ 유저 정보 가져오기 실패, mock 사용:', err);
        try {
          const mockData = await getUserInfoMock(); // fallback
          console.log('🔍 mockData', mockData);
          setUser(mockData);
          setIsDependent(mockData.role === 'DEPENDENT');
        } catch (mockError) {
          console.error('❌ mockData 가져오기 실패:', mockError);
          setError(mockError);
        }
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [useMock]);

  return { user, isDependent, loading, error };
}
