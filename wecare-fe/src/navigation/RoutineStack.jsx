import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoutineScreen from '../screen/Routine/RoutineScreen';
import InvitationScreen from '../screen/Routine/InvitationScreen';
import HeaderRoutine from '../components/common/HeaderRoutine';
import Header from '../components/common/Header';
import AllTodoScreen from '../screen/Routine/AllTodoScreen';
import TodoForm from '../screen/Routine/TodoForm';
import { useForm } from 'react-hook-form';
import { createRoutine } from '../providers/api';
import DetailTodoScreen from '../screen/Routine/DetailTodoScreen';
import { useAuthStore } from '../store/authStore';
import PatchRoutineScreen from '../screen/Routine/PatchRoutineScreen';
import { useNavigation } from '@react-navigation/native';
import usePartnerStore from '../store/partnerStore';
import { Alert } from 'react-native';
// import DailyRoutineScreen from '../screen/Routine/DailyRoutineScreen';

const Stack = createStackNavigator();

const AddRoutineStack = () => {
  const { partnerId } = usePartnerStore();
  const { 
    control, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      iconType: 'MEDICATION', // 기본 아이콘
      todoTitle: '',
      keywords: [],
      todoMemo: '',
      selectedDate: new Date(),
      selectedTime: null,
      repeatDays: [],
      notificationSettings: {
        enabled: false,
        time: null,
        sound: null
      }
    }
  });
  const navigation = useNavigation();

  const handleSavePress = async () => {
    console.log('저장 클릭');
    console.log(watch());
    // watch 데이터를 파싱하여 payload 생성(해야되는데 그냥 string 박음)
    // const response = await createRoutine
    const payload = {
      "startTime": "19:30:00",
      "endTime": "19:40:00",
      "title": "산책하기",
      "routineType": "ACTIVITY",
      "isAlertActive": true,
      "notificationType": "NONE",
      "soundType": "DEFAULT_SOUND",
      "guardianMemo": null,
      "dependentMemo": null,
      "repeatDays": ["MON", "SUN"],
    }
    const response = await createRoutine(payload, 2);
    console.log('🔍 response: ', response);
    if(response.status === 200) {
      Alert.alert('할 일 추가 성공');
    } else {
      Alert.alert('할 일 추가 실패');
    }
    navigation.navigate('RoutineMain');
  };

  return (
    <>
      <HeaderRoutine
        title='할 일 추가'
        backButton={false}
        saveButton={true}
        saveTitle='저장'
        onSavePress={handleSavePress}
      />
      <TodoForm
        control={control}
        handleSubmit={handleSubmit}
        setValue={setValue}
        watch={watch}
        errors={errors}
      />
    </>
  );
};

//TODO: 할 일 수정 스택 ... 완성 안됨
const PatchRoutineStack = () => {
  const { 
    control, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      iconType: 'MEDICATION', // 기본 아이콘
      todoTitle: '',
      keywords: [],
      todoMemo: '',
      selectedDate: new Date(),
      selectedTime: null,
      repeatDays: [],
      notificationSettings: {
        enabled: false,
        time: null,
        sound: null
      }
    }
  });

  const handleSavePress = () => {
    console.log('저장 클릭');
    console.log(watch());
    // API 호출
  };

  return (
    <>
      <HeaderRoutine
        title='할 일 수정'
        backButton={false}
        saveButton={true}
        saveTitle='수정'
        onSavePress={handleSavePress}
      />
      <TodoForm
        control={control}
        handleSubmit={handleSubmit}
        setValue={setValue}
        watch={watch}
        errors={errors}
      />
    </>
  );
}

export default function RoutineStack() {
  const {role} = useAuthStore();
  const navigation = useNavigation();
  const {partnerName} = usePartnerStore();
  console.log('🔍 partnerName: ', partnerName);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='RoutineMain'
        component={RoutineScreen}
        options={{
          header: () => (
            <Header
              title='위케어'
              onBellPress={() => console.log('Bell pressed')}
              onNotificationPress={() => console.log('Noti pressed')}
            />
          ),
        }} // 또는 custom header
      />
      <Stack.Screen
        name='InvitationScreen'
        component={InvitationScreen}
        options={{
          header: () => (
            <HeaderRoutine
              backgroundType='fill'
              title='가족 추가하기'
              saveButton={false}
              backButton={true}
              titleColored={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name='AllTodoScreen'
        component={AllTodoScreen}
        options={{
          header: () => <HeaderRoutine title={`${partnerName} 님의 하루`} backButton={true} saveButton={false} />,
        }}
      />
      <Stack.Screen
        name='AddTodoForm'
        component={AddRoutineStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='DetailTodoScreen'
        component={DetailTodoScreen}
        options={{
          header: () => <HeaderRoutine title='할 일' 
                            backButton={false} 
                            saveButton={role==='GUARDIAN' ? true : false} 
                            saveTitle={'수정'} 
                            onSavePress={() => navigation.navigate('PatchTodoScreen')} />,
        }}
      />
      {/* //TODO: 수정페이지 스택 추가 */}
      <Stack.Screen
        name='PatchTodoScreen'
        component={PatchRoutineStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
