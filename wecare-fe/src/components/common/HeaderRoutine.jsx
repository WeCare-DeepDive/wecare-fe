import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconDateYesterday from '../../../assets/Iconsvg/Idea/IconDateYesterday.svg';
import { Theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';

export default function HeaderRoutine({
  backgroundType = 'fill',
  title,
  saveButton = false,
  backButton = true,
  saveTitle = '저장',
  titleColored = false,
  onSavePress,
}) {
  const navigation = useNavigation();

  const handleSavePress = () => {
    if (onSavePress) {
      onSavePress();
    }
  };

  return (
    <SafeAreaView
      style={[backgroundType === 'fill' ? styles.fillBackground : styles.transparentBackground]}
      edges={['top']}>
      <View style={styles.shadowWrapper}>
        <View style={styles.header}>
          {/* 왼쪽 영역 - 뒤로가기 버튼 */}
          <View style={styles.leftSection}>
            {backButton && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <IconDateYesterday style={styles.backIcon} />
              </TouchableOpacity>
            )}
          </View>

          {/* 중앙 영역 - 타이틀 (항상 중앙에 위치) */}
          <View style={styles.centerSection}>
            <Text style={[styles.title, titleColored ? styles.titleColored : styles.titleTransparent]}>{title}</Text>
          </View>

          {/* 오른쪽 영역 - 저장 버튼 */}
          <View style={styles.rightSection}>
            {saveButton && (
              <TouchableOpacity
                onPress={handleSavePress}
                style={styles.saveButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.saveButtonText}>{saveTitle}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fillBackground: {
    backgroundColor: Theme.Colors.customWhite,
  },
  transparentBackground: {
    backgroundColor: Theme.Colors.purple300,
  },
  shadowWrapper: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 60,
    backgroundColor: Theme.Colors.customWhite,
  },
  // 왼쪽 섹션 - 뒤로가기 버튼 영역
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  // 중앙 섹션 - 타이틀 영역 (항상 화면 중앙에 위치)
  centerSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // 좌우 버튼보다 아래에 위치
  },
  // 오른쪽 섹션 - 저장 버튼 영역
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2, // 타이틀보다 위에 위치
  },
  backButton: {
    padding: 4, // 터치 영역 확대
  },
  backIcon: {
    // 필요시 아이콘 스타일 추가
  },
  title: {
    fontSize: Theme.FontSize.size_32 || 24,
    lineHeight: Theme.LineHeight.lineHeight_38 || 38,
    fontFamily: Theme.FontFamily.nanumR,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleColored: {
    color: Theme.Colors.purple500,
  },
  titleTransparent: {
    color: Theme.Colors.colorBlack,
  },
  saveButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Theme.Colors.purple500,
  },
});
