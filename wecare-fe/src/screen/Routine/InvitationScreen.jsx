import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Alert } from 'react-native';
import { Theme } from '../../styles/theme';
import { Controller, useForm } from 'react-hook-form';
import FormInput from '../../components/forms/FormInputs';
import { Picker } from '@react-native-picker/picker';
import InputWithButton from '../../components/forms/InputWithButton';
import CustomButton from '../../components/buttons/Button';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useInvite } from '../../hooks/useInvite';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuthStore } from '../../store/authStore';
import { getUserInviteAccept } from '../../providers/api';
// TODO: 초대코드 불러오기 초대코드 무조건 불러와져야함!!!!
//       초대코드 입력받는부분(상대방에게 전달받았을 때) 이부분은 폼으로 넘겨야함

export default function InvitationScreen() {
  // DropDownPicker용 상태 추가
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: '부모', value: 'PARENT' },
    { label: '조부모', value: 'GRANDPARENT' },
    { label: '형제/자매', value: 'SIBLING' },
    { label: '친구', value: 'FRIEND' },
    { label: '친척', value: 'RELATIVE' },
    { label: '기타', value: 'OTHER' },
  ]);

  // 초대코드 불러오기
  const { inviteCode, 
    isLoading, 
    isSuccess, 
    inviteCodeError, 
    invitationsAccept,
    fetchInviteCode } = useInvite({ useMock: false });

  // 사용자 정보 불러오기 - authStore에서 가져오기
  const { user, isLoading: loading, error } = useAuthStore();
  const isDependent = user?.role === 'DEPENDENT';

  // 폼 상태 관리
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      invitationCode: '',
      relationshipType: '',
    },
    mode: 'onChange',
  });

  // isDependent에 따른 폰트 크기 결정
  const fontSize = isDependent ? Theme.FontSize.size_24 : Theme.FontSize.size_18;
  const lineHeight = isDependent ? Theme.LineHeight[24] : Theme.LineHeight[18];

  // 화면 로딩 시 초대코드 불러오기
  useEffect(() => {
    if (inviteCode === null) {
      fetchInviteCode();
    }
  }, []);

  // 네비게이션
  const navigation = useNavigation();

  // 에러 발생 시 alert 처리 (훅 순서 깨지지 않도록 수정)
  useEffect(() => {
    if (error) {
      if(error.message !== null) {
        Alert.alert('Error', error.message);
      }
    }
  }, [error, navigation]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // 초대코드 복사
  const handleCopy = async () => {
    if (!inviteCode) return;

    await Clipboard.setStringAsync(inviteCode);
    // 임의로 넣은 알러트 창()
    Alert.alert('초대코드가 복사되었습니다.', '가족에게 공유를 하여 함께 이용해보아요!');
  };

  // 입력값 감시
  const watchedValues = watch();
  const isFormValid = watchedValues.invitationCode && watchedValues.relationshipType && isValid;

  // 저장 버튼 눌렀을 때 처리
  const onSubmit = async (data) => {
    console.log('🔍 저장 버튼 눌렀을 때 처리:', data);
    const response = await getUserInviteAccept(data);
    console.log('🔍 초대 코드 수락 응답:', response);
    if (response.status === 200) {
      // 하루 메인으로 다시 이동 => 만약 성공을 했을 시, 성공 했다는 모달을 띄워야함
      navigation.navigate('RoutineMain', { showModal: true });
    }

    return navigation.navigate('RoutineMain', { showModal: true });
  };

  // 스타일 수정 (LineHeight 등 DropDownPicker에선 직접 적용 X)
  const dropdownTextStyle = {
    fontSize: fontSize,
    lineHeight: lineHeight,
  };

  return (
    <SafeAreaView style={styles.safeareaview}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.view}>
          <View style={styles.codeshareParent}>
            <View style={styles.codeshare}>
              {/* //아래 부분 인풋윗버튼 컴포넌트로 수정해야함 */}
              <InputWithButton 
                label='초대코드'
                fontSize={fontSize}
                lineHeight={lineHeight}
                value={inviteCode}          
                // value={'12345'}    // UI test용
                buttonTitle='공유'
                isActive={true}
                onPress={handleCopy}
              />
            
              <FormInput 
                control={control}
                name='invitationCode'
                label='상대방 초대코드를 전달받으셨나요?'
                placeholder='초대코드 입력'
                rules={{ required: '초대코드 입력' }}
                errors={errors}
                fontSize={fontSize}
                lineHeight={lineHeight}
              />
              {errors.invitationCode && <Text style={styles.errorText}>{errors.invitationCode.message}</Text>}

              <View style={styles.inputset}>
                <Text style={[styles.label, { fontSize: fontSize, lineHeight: lineHeight }]}>
                  상대방과의 관계가 어떻게 되시나요?
                </Text>
                <View style={styles.dropdownWrapper}>
                  <Controller
                    control={control}
                    name='relationshipType'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={(callback) => {
                          const newValue = callback(value);
                          onChange(newValue);
                        }}
                        setItems={setItems}
                        placeholder="선택해주세요"
                        style={styles.dropdown}
                        textStyle={dropdownTextStyle}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={5000} // 중첩 문제 방지
                        zIndexInverse={1000}
                      />
                    )}
                  />

                  {errors.relationshipType && <Text style={styles.errorText}>{errors.relationshipType.message}</Text>}
                </View>
              </View>
            </View>
          </View>
        </View>
          {/* 저장 버튼 */}
          <View style={styles.buttonContainer}>
            <CustomButton 
              title='연결하기'
              size='large'
              variant='filled'
              isActive={isFormValid && !isLoading}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaview: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  label: {
    color: Theme.Colors.customBlack,
    textAlign: 'left',
    fontFamily: Theme.FontFamily.pretendard,
    fontWeight: '500',
    marginBottom: 10,
  },
  dropdown: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: Theme.Colors.gray9,
    borderRadius: 4,
    backgroundColor: Theme.Colors.white,
  },
  dropdownItem: {
    width: '100%'
  },
  view: {
    height: 917,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#fff',
    flex: 1,
  },
  codeshareParent:{
    top: Theme.Padding.xxl,
    gap: 36,
    paddingHorizontal: 20,
    left: 0,
  },
  codeshare: {
    gap: 10,
  },
  inputset: {
    width: '100%',
  },
  dropdownWrapper: {
    width: '100%',
    height: 56,
  },
  dropdownContainer:{
    borderColor: Theme.Colors.gray9,
    backgroundColor: Theme.Colors.white,
    zIndex: 5000, // zIndex가 높아야 다른 UI 요소 위에 표시됨
    borderRadius: 4,
    borderWidth: 1,
  },
  buttonContainer:{
    // 가장 아래에 위치하도록 함
    paddingHorizontal: 20,
    paddingBottom: Theme.Padding.xl,
    backgroundColor: Theme.Colors.white,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  }
});
