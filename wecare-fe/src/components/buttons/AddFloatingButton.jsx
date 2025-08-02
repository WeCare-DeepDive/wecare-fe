import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';

const AddFloatingButton = ({ onPress, style, size = 56 }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={[styles.button, { width: size, height: size }]}>
        <Text style={[styles.plusIcon, { fontSize: size * 0.7 }]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#6C5CE7',
    borderRadius: 1000, // 완전한 원형을 위해 큰 값 사용
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#6C5CE7',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
        shadowColor: '#6C5CE7',
      },
    }),
  },
  plusIcon: {
    color: 'white',
    fontWeight: '400',
    lineHeight: undefined, // 크로스 플랫폼 호환성을 위해
  },
});

export default AddFloatingButton;
