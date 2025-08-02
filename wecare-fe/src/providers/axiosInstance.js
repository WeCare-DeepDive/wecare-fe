// axios 인스턴스 생성

import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL, API_TIMEOUT, LOG_LEVEL } from '../config/environment';

// Zustand store의 getState와 setState를 직접 가져오기
const authStore = useAuthStore;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.useAuth != null && config.useAuth === true) {
      // access token 사용
      console.log('useAuth가 적용된 요청입니다.');
      const { accessToken } = authStore.getState();
      console.log('📌 accessToken:', accessToken); // 추가해보기
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    if (LOG_LEVEL === 'debug') {
      console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
      console.log('📤 Request Config:', config);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    if (LOG_LEVEL === 'debug') {
      console.log('📥 API Response status:', response.status);
      console.log('✅ API Response data:', response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('🔍 Full Error Response:', error.response);
    // 401 에러이고 토큰 갱신을 시도하지 않은 경우
    // 401 토큰 만료된거 까지 정보를 넘겨줘야 해
    // TODO 401로 바꾸고 토큰 만료 코드 넘겨줘야 함
    const status = error.response?.status;
    if (status === 402) {
      try {
        const { refreshToken } = authStore.getState();
        if (!refreshToken) throw new Error('리프레시 토큰이 없습니다.');

        console.log('🔄 토큰 갱신 시도...');

        // interceptor 영향 받지 않도록 별도 인스턴스로 요청
        const tokenRefreshClient = axios.create({
          baseURL: API_BASE_URL,
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await tokenRefreshClient.post('/auth/refresh', { refreshToken });
        const { accessToken, newRefreshToken } = response.data;

        authStore.getState().setTokens(accessToken, newRefreshToken || refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return this.axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패:', refreshError);
        authStore.getState().forceLogout();
        return;
      }
    }

    if (LOG_LEVEL !== 'error') {
      console.error('❌ API Response Error:', error);
    }

    // 타임아웃 에러 처리
    if (error.code === 'ECONNABORTED') {
      throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    }

    // HTTP 에러 처리
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = `HTTP error! status: ${status}`;

      if (data) {
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }

      throw new Error(errorMessage);
    }

    throw error;
  }
);

export default axiosInstance;
