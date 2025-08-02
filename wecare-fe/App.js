/**
 * TODO
 * - 아이콘(어플 아이콘) 해상도별로 리사이즈 필요(디자이너에게 부탁하기)
 * 
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './src/navigation/BottomNavigation';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, Image } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import AuthNavigatino from './src/navigation/AuthNavigatino';
import NotificationHandler from './src/providers/notification';
import { LOG_LEVEL } from './src/config/environment';
// import { login } from './src/providers/api';

const fetchFonts = async () => {
  try {
    await Font.loadAsync({
      PretendardVariable: require('./assets/fonts/PretendardVariable.ttf'),
      NanumSquareRoundOTFB: require('./assets/fonts/NanumSquareRoundOTFB.otf'),
      NanumSquareRoundOTFEB: require('./assets/fonts/NanumSquareRoundOTFEB.otf'),
      NanumSquareRoundOTFL: require('./assets/fonts/NanumSquareRoundOTFL.otf'),
      NanumSquareRoundOTFR: require('./assets/fonts/NanumSquareRoundOTFR.otf'),
    });
    console.log('Fonts loaded successfully');
  } catch (error) {
    console.error('Font loading error:', error);
    throw error;
  }
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [error, setError] = useState(null);
  const navigationRef = useRef(null);
  
  // 로그인 정보
  const { isAuthenticated, setNavigationRef, forceLogout, login } = useAuthStore();

  useEffect(() => {
    //test를 위해 미리 로그인 처리
    // const loginTest = async () => {
    //   // 개발 환경에서만 자동 로그인 실행
    //   if (LOG_LEVEL === 'debug') {
    //     try {
    //       console.log('🧪 개발 환경 - 자동 로그인 테스트 실행');
    //       await login({
    //         userId: 'qwer1234',
    //         password: 'qwer1234!!',
    //       });
    //     } catch (error) {
    //       console.error('❌ 자동 로그인 실패:', error);
    //     }
    //   }
    // };
    // loginTest();
    
    async function prepare() {
      try {
        console.log('Starting app preparation...');
        await fetchFonts();
        
        // 저장된 토큰 확인 (메모리 기반이므로 앱 재시작 시에는 없음)
        console.log('App started - no persistent tokens in memory storage');
        
        console.log('App preparation complete');
      } catch (e) {
        console.error('App preparation error:', e);
        setError(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // 네비게이션 참조 설정
  useEffect(() => {
    setNavigationRef(navigationRef.current);
  }, [setNavigationRef]);

  // 강제 로그아웃 이벤트 감지
  useEffect(() => {
    const handleForceLogout = () => {
      console.log('🚨 강제 로그아웃 이벤트 감지');
      forceLogout();
    };

    // React Native에서는 window 객체가 없으므로 다른 방식으로 이벤트 처리
    // apiProvider에서 직접 forceLogout 호출하도록 수정
    return () => {
      // cleanup if needed
    };
  }, [forceLogout]);

  // 앱이 준비되면 스플래시 스크린 숨기기
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [appIsReady]);

  if (!appIsReady) {
    console.log('Rendering splash screen');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#3D1BFF',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('./assets/splash-full.png')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>
    );
  }

  // 에러가 있다면 에러 화면 표시
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading app: {error.message}</Text>
      </View>
    );
  }

  // 푸시알림 라우팅 핸들러
//  const handlePushNotification = useCallback((data, context) => {
//   console.log('🔍 data: ', data);
//   console.log('🔍 context: ', context);

//   // if(!navigationRef.current || !isAuthenticated) {
//   //   console.log('🔍 네비게이션이 준비되지 않았거나 로그인 하지 않은 경우');
//   // }  

//   // 푸시알림 데이터에서 페이지 정보 있는 경우에만 네비게이션 실행
//   // page 데이터가 있는 경우에만 네비게이션 실행
//   // if (data && data.page) {
//   //   handlePushNotificationRouting(data.page, data);
//   // }
//  }, [isAuthenticated]);

  return (
    <>
    {/* 네비게이션 컨테이너 */}
    <NavigationContainer ref={navigationRef}>
      {/* 로그인여부에 따른 네비게이션 컴포넌트 렌더링 */}
      {isAuthenticated ? <BottomNavigation /> : <AuthNavigatino />}
    </NavigationContainer>
    {/* 푸시 알림 처리 컴포넌트 */}
    <NotificationHandler onDataReceived={(data, context) => {
      // handlePushNotification(data, context);
    }}/>
    </>
    
  );
}
