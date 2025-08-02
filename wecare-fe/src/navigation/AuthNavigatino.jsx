import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screen/Auth/MainScreen';
import RegisterScreen from '../screen/Auth/RegisterScreen';
import LoginScreen from '../screen/Auth/LoginScreen';
import AuthHeader from '../components/common/AuthHeader';
import RegisterFormScreen from '../screen/Auth/RegisterFormScreen';
import { useAuthStore } from '../store/authStore';
import apiProvider from '../providers/apiProvider';

const Stack = createStackNavigator();
export default function AuthNavigatino() {
  // const { login } = useAuthStore();
  // useEffect(() => {
  //   login({ userId: 'love999', password: 'love999!!' });
  // }, []);

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => {
          if (route.name === 'Main') {
            return null;
          }

          const title = route.name === 'Login' ? '로그인' : '회원가입';

          return <AuthHeader title={title} />;
        },
      })}>
      <Stack.Screen name='Main' component={MainScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='RegisterForm' component={RegisterFormScreen} />
    </Stack.Navigator>
  );
}
