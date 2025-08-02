import { create } from 'zustand';
import apiProvider from '../providers/apiProvider';

const useAuthStore = create((set, get) => ({
  // 개발할 때 사용하는 user 정보(추후 삭제)
  user: null,
  isAuthenticated: false, // 처음 시작은 무조건 false
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  navigationRef: null, // 네비게이션 참조 저장
  role: null,

  //로그인 액션
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiProvider.login(credentials);
      
      // API 응답에서 토큰 추출
      const { accessToken, refreshToken } = response;
      
      // 토큰을 zustand 상태에 저장
      set({
        accessToken,
        refreshToken,
      });
      
      // 사용자 정보 가져오기
      let user = null;
      try {
        // 약간의 딜레이 (임시 디버깅용)        
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기

        user = await apiProvider.getUserInfo();
      } catch (error) {
        console.warn('Failed to fetch user info:', error);
        // 임시로 기본 사용자 정보 설정 (토큰에서 추출 가능한 정보 사용)
        // user = {
        //   id: 0,
        //   username: credentials.userId,
        //   name: '김보호',
        //   gender: 'MALE',
        //   birthDate: '2000-01-01',
        //   role: 'GUARDIAN',
        //   createdAt: '2025-08-02T04:42:06.610Z',
        //   updatedAt: '2025-08-02T04:42:06.610Z',
        // };
      }
      set({
        user,
        isAuthenticated: true,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
        role: user.role,
      });
      
      console.log('토큰이 살아있는지 확인:', accessToken?.substring(0, 20) + '...');
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error:', error.response);
      set({
        isLoading: false,
        error: error.message || '로그인에 실패했습니다.',
      });
      throw error;
    }
  },

  // 회원가입 액션 (자동 로그인 포함)
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // 1. 회원가입 API 호출
      console.log('Starting registration process...');
      const signupResponse = await apiProvider.signup(userData);
      // console.log('Signup successful:', signupResponse);
      // console.log('Signup userData', userData);
      
      // 2. 회원가입 성공 후 자동 로그인
      console.log('Auto-login after successful signup...');
      const loginResponse = await apiProvider.login({
        userId: userData.username,
        password: userData.password,
      });
      // console.log('loginResponse', loginResponse);
      
      // 3. 로그인 응답에서 토큰 추출
      if (!loginResponse || !loginResponse.accessToken) {
        throw new Error('로그인 응답에서 토큰을 찾을 수 없습니다.');
      }
      
      const { accessToken, refreshToken } = loginResponse;
      
      // 4. zustand 상태에 저장
      set({
        accessToken,
        refreshToken,
      });

      // 5. 사용자 정보 가져오기
      let user = null;
      try {
        user = await apiProvider.getUserInfo();
      } catch (error) {
        console.warn('Failed to fetch user info:', error);
        // 임시로 기본 사용자 정보 설정
        user = {
          id: null,
          username: userData.username,
          role: userData.role || 'GUARDIAN',
        };
      }
      
      // 5. 상태 업데이트
      set({
        user,
        isAuthenticated: true,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      });

      console.log('Registration and auto-login completed successfully');
      return { success: true, user };
    } catch (error) {
      console.log(error);
      console.error('Registration error:', error);
      set({
        isLoading: false,
        error: error.message || '회원가입에 실패했습니다.',
      });
      throw error;
    }
  },

  // 로그아웃 액션
  logout: async () => {
    // zustand 상태에서 토큰 삭제
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      error: null,
    });

    // 네비게이션이 설정되어 있으면 로그인 화면으로 이동
    const { navigationRef } = get();
    if (navigationRef) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  },

  // 강제 로그아웃 액션 (토큰 만료 시)
  forceLogout: async () => {
    console.log('🔄 강제 로그아웃 실행...');
    await get().logout();
  },

  // 네비게이션 참조 설정
  setNavigationRef: (ref) => set({ navigationRef: ref }),

  // 사용자 정보 설정
  setUser: (user) => set({ user }),

  // 인증 상태 설정
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  // 토큰 설정
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 로딩 상태 설정
  setLoading: (isLoading) => set({ isLoading }),

  // 사용자 정보 조회
  fetchUserInfo: async () => {
    const { accessToken } = get();
    if (!accessToken) return;

    try {
      const user = await apiProvider.getUserInfo();
      set({ user });
    } catch (error) {
      console.error('Fetch user info error:', error);
      // 토큰이 만료된 경우 로그아웃 (이제 인터셉터에서 처리됨)
      if (error.message.includes('401')) {
        get().logout();
      }
    }
  },

  // 토큰 갱신
  refreshAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;

    try {
      const response = await apiProvider.refreshToken(refreshToken);
      const { accessToken, newRefreshToken } = response;
      
      set({
        accessToken,
        refreshToken: newRefreshToken || refreshToken,
      });
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      get().logout();
      return false;
    }
  },
}));

// apiProvider에 store 참조 설정
apiProvider.setAuthStore(useAuthStore);

export { useAuthStore };
