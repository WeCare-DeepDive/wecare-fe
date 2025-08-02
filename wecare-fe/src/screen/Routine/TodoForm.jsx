import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import IconGrid from '../../components/Iconsvg/IconGrid';
import KeywordComponent from '../../components/keyword/KeywordComponents';
import { TextInput } from 'react-native';
import { Theme } from '../../styles/theme';
import DateSelector from '../../components/dateTimePicker/DateSelector';
import TimePicker from '../../components/dateTimePicker/TimePicker';
import RepeatDayPicker from '../../components/dateTimePicker/RepeatDayPicker';
import NotificationSettings from '../../components/modal/NotificationSettings';
import { useNavigation } from '@react-navigation/native';
import { keywords } from '../../mocks/routineMock';
import useUserInfo from '../../hooks/useUserInfo';



const TodoForm = ({
  control,
  handleSubmit,
  setValue,
  watch,
  errors
}) => {
  const {user, loading, error} = useUserInfo({useMock: false});
  const navigation = useNavigation();
  
  // 폼 제출 핸들러
  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // 여기에 실제 저장 로직을 추가할 수 있습니다
    
  };

  const handleIconPress = (icon) => {
    setValue('iconType', icon);
    console.log(`아이콘 선택: ${icon.name} 타입 선택`);
  };

  const handleEditPress = () => {
    console.log('편집 모드 토글');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 상단 영역: IconGrid + TextInput */}
        <View style={styles.topSection}>
          {/* IconGrid를 왼쪽에 배치 */}
          <View style={styles.iconGridWrapper}>
            <Controller
              control={control}
              name="iconType"
              render={({ field: { value } }) => (
                <IconGrid 
                  onIconPress={handleIconPress} 
                  onEditPress={handleEditPress} 
                  showEditButton={true} 
                  selectedIcon={value}
                />
              )}
            />
          </View>

          {/* TextInput을 오른쪽에 배치 */}
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="todoTitle"
              rules={{ 
                required: '할 일 제목을 입력해 주세요' 
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder='할 일 제목을 입력해 주세요.'
                  value={value}
                  onChangeText={onChange}
                  multiline={true}
                  textAlignVertical="top"
                />
              )}
            />
          </View>
        </View>

        {/* 키워드 영역 */}
        <View style={styles.keywordSection}>
          <Text style={styles.keywordLabel}>키워드</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.keywordScrollView}
            contentContainerStyle={styles.keywordScrollContent}
          >
            {keywords.map((keyword) => (
              <KeywordComponent 
              key={keyword.id} 
              keyword={keyword.name} 
              isSelected={false}
              onPress={() => {
                // 키워드 선택 로직
                console.log('키워드 선택:', keyword.name);
              }}
              />
          ))}
          </ScrollView>
        </View>       

        {/* 나의 메모 영역 */}
        <View style={styles.memoSection}>
          <Text style={styles.memoTitle}>나의 메모</Text>
          <View style={styles.memoInputWrapper}>
            <Controller
              control={control}
              name="todoMemo"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.memoInput}
                  placeholder='메모를 작성해보세요.'
                  value={value}
                  onChangeText={onChange}
                  multiline={true}
                  textAlignVertical="top"
                />
              )}
            />
          </View>
        </View>

        {/* 날짜 선택 영역 */}
        {/* <Controller
          control={control}
          name="selectedDate"
          render={({ field: { value } }) => (
            <DateSelector 
              onDateSelect={(date) => setValue('selectedDate', date)}
              initialDate={value}
              isDependent={false}
              style={styles.dateSection}
            />
          )}
        /> */}

        {/* 시간 선택 영역 */}
        <Controller
          control={control}
          name="selectedTime"
          render={({ field: { value } }) => (
            <TimePicker 
              onTimeSelect={(time) => setValue('selectedTime', time)}
              isDependent={false}
              style={styles.timeSection}
            />
          )}
        />

        {/* 반복 요일 선택 영역 */}
        <Controller
          control={control}
          name="repeatDays"
          render={({ field: { value } }) => (
            <RepeatDayPicker 
              onDaysSelect={(days) => setValue('repeatDays', days)}
              isDependent={false}
              style={styles.repeatSection}
            />
          )}
        />

        {/* 알림 설정 영역 */}
        <Controller
          control={control}
          name="notificationSettings"
          render={({ field: { value } }) => (
            <NotificationSettings 
              onSettingsChange={(settings) => setValue('notificationSettings', settings)}
              isDependent={false}
              style={styles.notificationSection}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // 상단 섹션 (IconGrid + TextInput)
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  
  // IconGrid 래퍼
  iconGridWrapper: {
    marginRight: 16,
  },
  
  // TextInput 래퍼
  inputWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 100,
    maxHeight: 150,
  },
  
  input: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'top',
  },
  
  // 키워드 섹션
  keywordSection: {
    marginBottom: 32,
  },
  
  keywordLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  
  keywordScrollView: {
    marginBottom: 16,
  },
  
  keywordScrollContent: {
    alignItems: 'center',
    paddingRight: 20,
  },

  // 나의 메모 섹션
  memoSection: {
    marginBottom: 32,
  },

  memoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.Colors.labelsPrimary,
    marginBottom: 16,
  },

  memoInputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 120,
  },

  memoInput: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'top',
  },

  dateSection: {
    marginBottom: 32,
  },

  timeSection: {
    marginBottom: 32,
  },

  repeatSection: {
    marginBottom: 32,
  },

  notificationSection: {
    marginBottom: 32,
  },

  // 제출 버튼
  submitButton: {
    backgroundColor: '#6B73FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TodoForm;