// NotificationHandler.js
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

const NotificationHandler = ({ onDataReceived }) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // 1. 앱이 포그라운드에서 알림을 받았을 때
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 포그라운드에서 알림 받음:', notification);
      
      // data 추출
      const data = notification.request.content.data;

      console.log('📦 알림 데이터:', data);
      
      if (data) {
        // 데이터 처리 (예: 특정 화면으로 이동, 상태 업데이트 등)
        handleNotificationData(data, 'foreground_received');
      }
    });

    // 2. 사용자가 알림을 탭했을 때 (백그라운드, 종료 상태 모두 포함)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 알림 탭됨:', response);
      
      // data 추출
      const data = response.notification.request.content.data;
      console.log('📦 탭한 알림 데이터:', data);
      
      if (data) {
        // 데이터 처리
        handleNotificationData(data, 'tapped');
      }
    });

    // 3. 앱이 완전히 종료된 상태에서 알림을 탭해서 실행된 경우
    checkInitialNotification();

    return () => {
      // 리스너 정리
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // 앱 시작 시 알림으로 실행되었는지 확인
  const checkInitialNotification = async () => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      console.log('🚀 앱이 알림으로 실행됨:', response);
      
      const data = response.notification.request.content.data;
      if (data) {
        console.log('📦 초기 실행 알림 데이터:', data);
        handleNotificationData(data, 'app_launched');
      }
    }
  };

  // 알림 데이터 처리 함수
  const handleNotificationData = (data, context) => {
    console.log(`📋 데이터 처리 (${context}):`, data);
    
    // 부모 컴포넌트로 데이터 전달
    if (onDataReceived) {
      onDataReceived(data, context);
    }

    // 데이터 타입에 따른 처리
    if (data.type) {
      switch (data.type) {
        case 'navigate':
          // 특정 화면으로 이동
          console.log('네비게이션 데이터:', data.screen, data.params);
          break;
        case 'update':
          // 데이터 업데이트
          console.log('업데이트 데이터:', data.payload);
          break;
        case 'action':
          // 특정 액션 실행
          console.log('액션 실행:', data.action);
          break;
        default:
          console.log('기본 데이터 처리:', data);
      }
    }
  };

  return null;
};

export default NotificationHandler;