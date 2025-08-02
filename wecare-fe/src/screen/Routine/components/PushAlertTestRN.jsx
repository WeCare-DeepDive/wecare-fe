//TODO
/** */

// 필요한 기능
// 알림 받았음 -> 
//    알림 화면으로 이동

/**
 * TODO 모델링 적용하기
 * {
 *   type: "navgiate" // 이동
 *   page: "alaram detail"
 *   payload: {
 *     todoId: 1,
 *     todoContent: "알림 테스트 내용",
 *     todoDate: "2025-01-01",
 *     todoTime: "12:00",
 *     todoLocation: "서울시 강남구",
 *     todoStatus: "완료",
 *     todoPriority: "높음",
 * }
 * }
 */

import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import PushController from '../../../utils/PushController';
import * as Notifications from 'expo-notifications';
import {routineGuardian} from '../../../mocks/routineMock';

function PushAlertTestRN(props) {
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const alert = routineGuardian[0];

  // PushController에서 권한 상태 받기
  const handlePermissionChange = (status) => {
    setPermissionStatus(status);
    console.log('권한 상태 변경:', status);
  };

  const scheduleNotification = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('알림 권한이 필요합니다', '먼저 알림 권한을 허용해주세요.');
      return;
    }

    Alert.alert('1분 뒤 푸시 알림을 띄웁니다.', '확인하고 버튼을 눌러주세요.');
    console.log('지금시간: ', new Date().toLocaleString());
    console.log('1분 뒤 시간: ', new Date(Date.now() + 60000).toLocaleString());
    
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: alert.title,
          body: alert.guardianMemo,
          sound: 'default',
          data: {
            page: "alert",
            key: alert.id
          }
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(Date.now() + 60000),
          repeats: false, 
        },
      });
      
      console.log('알림 스케줄됨:', notificationId);
    } catch (error) {
      console.error('알림 스케줄 실패:', error);
      Alert.alert('오류', '알림 스케줄에 실패했습니다.');
    }
  };

  // const scheduleNotificationInterval2 = async () => {
  //   if (permissionStatus !== 'granted') {
  //     Alert.alert('알림 권한이 필요합니다', '먼저 알림 권한을 허용해주세요.');
  //     return;
  //   }

  //   Alert.alert('40초 간격 5회 반복 푸시 알림을 띄웁니다.', '확인하고 버튼을 눌러주세요.');
  //   console.log('지금시간: ', new Date().toLocaleString());
    
  //   try {
  //     for (let i = 1; i <= 5; i++) {
  //       const notificationId = await Notifications.scheduleNotificationAsync({
  //         content: {
  //           title: '40초 간격 5회 반복 푸시 알림',
  //           body: `40초 간격 5회 반복중 ${i}`,
  //           sound: 'default',
  //         },
  //         trigger: {
  //           seconds: 40 * i,
  //         },
  //       });
        
  //       console.log(`알림 ${i} 스케줄됨:`, notificationId, `${40 * i}초 후`);
  //     }
  //   } catch (error) {
  //     console.error('반복 알림 스케줄 실패:', error);
  //     Alert.alert('오류', '반복 알림 스케줄에 실패했습니다.');
  //   }
  // };

  // // 즉시 테스트 알림 (5초 후)
  // const testImmediateNotification = async () => {
  //   if (permissionStatus !== 'granted') {
  //     Alert.alert('알림 권한이 필요합니다', '먼저 알림 권한을 허용해주세요.');
  //     return;
  //   }

  //   Alert.alert('5초 후 테스트 알림이 표시됩니다.');
  //   console.log('5초 후 알림 스케줄:', new Date().toLocaleString());
    
  //   try {
  //     const notificationId = await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: '테스트 알림',
  //         body: '5초 후 알림 테스트 성공!',
  //         sound: 'default',
  //       },
  //       trigger: {
  //         seconds: 5,
  //       },
  //     });
      
  //     console.log('5초 테스트 알림 스케줄됨:', notificationId);
  //   } catch (error) {
  //     console.error('테스트 알림 실패:', error);
  //   }
  // };

  // 권한 재요청
  const requestPermissionAgain = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionStatus('granted');
      Alert.alert('성공', '알림 권한이 허용되었습니다.');
    } else {
      setPermissionStatus('denied');
      Alert.alert('실패', '알림 권한이 거부되었습니다. 설정에서 직접 허용해주세요.');
    }
  };

  // 스케줄된 알림 확인하기
  const checkScheduledNotifications = async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('스케줄된 알림들:', scheduledNotifications);
    Alert.alert(
      '스케줄된 알림',
      `현재 ${scheduledNotifications.length}개의 알림이 스케줄되어 있습니다.`
    );
  };

  // 모든 스케줄된 알림 취소
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('완료', '모든 스케줄된 알림이 취소되었습니다.');
    console.log('모든 알림 취소됨');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>푸시알림 테스트진행</Text>
      <Text style={{ 
        marginBottom: 20, 
        color: permissionStatus === 'granted' ? 'green' : 
              permissionStatus === 'denied' ? 'red' : 'orange',
        fontWeight: 'bold'
      }}>
        권한 상태: {permissionStatus}
      </Text>
      
      {permissionStatus !== 'granted' && (
        <>
          <Button title="권한 다시 요청" onPress={requestPermissionAgain} />
          <View style={{ height: 10 }} />
        </>
      )}
      
      {/* <Button 
        title="5초 후 테스트 알림" 
        onPress={testImmediateNotification}
        disabled={permissionStatus !== 'granted'}
      /> */}
      <View style={{ height: 10 }} />
      
      <Button 
        title="1분 뒤 푸시 알림 뜨기" 
        onPress={scheduleNotification}
        disabled={permissionStatus !== 'granted'}
      />
      {/* <View style={{ height: 10 }} />
      
      <Button 
        title="40초 간격 5회 반복" 
        onPress={scheduleNotificationInterval2}
        disabled={permissionStatus !== 'granted'}
      /> */}
      <View style={{ height: 10 }} />
      
      <Button title="스케줄된 알림 확인" onPress={checkScheduledNotifications} />
      <View style={{ height: 10 }} />
      
      <Button title="모든 알림 취소" onPress={cancelAllNotifications} />
      
      {/* PushController에 콜백 전달 */}
      <PushController onPermissionChange={handlePermissionChange} />
    </View>
  );
}

export default PushAlertTestRN;