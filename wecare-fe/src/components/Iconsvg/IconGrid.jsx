import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Theme } from '../../styles/theme';
import { typeIcons } from '../../constants/relationConstants';

// SVG 컴포넌트들을 직접 import
import IconCapsuleBtn from '@assets/Iconsvg/IconButtons/IconCapsuleBtn.svg';
import IconWalkBtn from '@assets/Iconsvg/IconButtons/IconWalkBtn.svg';
import IconMealBtn from '@assets/Iconsvg/IconButtons/IconMealBtn.svg';
import IconNoteBtn from '@assets/Iconsvg/IconButtons/IconNoteBtn.svg';
import IconCapsulePinkBtn from '@assets/Iconsvg/IconButtons/IconCapsulePinkBtn.svg';

const IconGrid = ({ icons = [], onIconPress, onEditPress, showEditButton = true, selectedIcon }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState(selectedIcon);
  const [animatedValue] = useState(new Animated.Value(0));

  // 전체 아이콘 데이터 - SVG 컴포넌트로 변경
  const allIcons = [
    {
      id: 1,
      name: 'MEDICATION',
      IconComponent: IconCapsuleBtn,
    },
    {
      id: 2,
      name: 'SUPPLEMENT',
      IconComponent: IconMealBtn,
    },
    {
      id: 3,
      name: 'ACTIVITY',
      IconComponent: IconWalkBtn,
    },
    {
      id: 4,
      name: 'CUSTOM',
      IconComponent: IconNoteBtn,
    },
  ];

  const getCurrentIcon = () => {
    return allIcons.find((icon) => icon.id === selectedIconId) || allIcons[0];
  };

  const handleIconPress = (icon) => {
    if (isEditMode) {
      setSelectedIconId(icon.id);
      // 애니메이션과 함께 편집 모드 종료
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsEditMode(false);
      });

      if (onIconPress) {
        onIconPress(icon.name);
      }
    } else {
      if (onIconPress) {
        onIconPress(icon.name);
      }
    }
  };

  const handleEditPress = () => {
    if (!isEditMode) {
      setIsEditMode(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsEditMode(false);
      });
    }

    if (onEditPress) {
      onEditPress();
    }
  };

  // 아이콘 렌더링 함수
  const renderIcon = (icon, isSelected = false) => {
    const IconComponent = icon.IconComponent;
    return (
      <TouchableOpacity
        key={icon.id}
        style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}
        onPress={() => handleIconPress(icon)}
        activeOpacity={0.7}>
        {/* SVG가 전체 영역을 차지하도록 수정 */}
        <View style={styles.iconWrapper}>
          <IconComponent width='100%' height='100%' style={styles.svgIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 첫 번째 행: 선택된 아이콘과 추가 아이콘들 */}
      <View style={styles.iconRow}>
        {/* 선택된 아이콘 (고정 위치) */}
        <View style={styles.selectedIconWrapper}>{renderIcon(getCurrentIcon(), !isEditMode)}</View>

        {/* 편집 모드일 때 추가 아이콘들 */}
        {isEditMode && (
          <Animated.View
            style={[
              styles.additionalIconsContainer,
              {
                opacity: animatedValue,
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              },
            ]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.additionalIconsScrollContainer}>
              {allIcons.filter((icon) => icon.id !== selectedIconId).map((icon) => renderIcon(icon, false))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      {/* 두 번째 행: 편집 버튼 (고정 위치) */}
      {showEditButton && (
        <View style={styles.editButtonRow}>
          <TouchableOpacity style={styles.editButtonContainer} onPress={handleEditPress} activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.editButton,
                {
                  backgroundColor: isEditMode ? '#FF6B6B' : '#8E8E93',
                },
              ]}>
              <Text style={styles.editButtonText}>{isEditMode ? '완료' : '편집'}</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },

  // 아이콘 행
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },

  selectedIconWrapper: {
    // 선택된 아이콘의 고정 위치
  },

  additionalIconsContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },

  additionalIconsScrollContainer: {
    alignItems: 'center',
  },

  // 편집 버튼 행
  editButtonRow: {
    alignItems: 'flex-start',
    height: 32,
  },

  // 공통 스타일
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    position: 'relative',
    width: 50, // 적절한 크기로 조정
    height: 50, // 적절한 크기로 조정
  },

  selectedIconContainer: {
    // 선택된 아이콘 스타일 (필요시 추가)
    // transform: [{ scale: 1.1 }], // 예: 선택된 아이콘을 약간 크게
  },

  // SVG를 감싸는 래퍼
  iconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // SVG 아이콘 스타일
  svgIcon: {
    // SVG가 wrapper 전체를 채우도록
  },

  editButtonContainer: {
    alignItems: 'center',
  },

  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButtonText: {
    color: Theme.Colors.customWhite,
    fontSize: 14,
    fontWeight: '600',
  },

  checkMark: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Theme.Colors.green500 || '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.Colors.customWhite,
  },

  checkMarkText: {
    color: Theme.Colors.customWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default IconGrid;
