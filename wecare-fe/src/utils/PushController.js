// PushController.js
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

function PushController({ onPermissionChange }) {
  useEffect(() => {
    const setupNotifications = async () => {
      // Android 알림 채널 설정
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      // 알림 권한 요청
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('알림 권한이 필요합니다!');
        onPermissionChange && onPermissionChange('denied');
      } else {
        onPermissionChange && onPermissionChange('granted');
      }
    };

    setupNotifications();

    // 알림 설정 옵션
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,  // shouldShowBanner 대신 shouldShowAlert 사용
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  return null;
}

export default PushController;