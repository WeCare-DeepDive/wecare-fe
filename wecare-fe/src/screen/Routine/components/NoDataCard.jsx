import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import Iconcontainer1 from '@assets/Iconsvg/Buttons/IconContainer.svg';
import { Colors, FontFamily, FontSize, Padding, Gap, BorderRadius } from '@styles/theme';
import { useNavigation } from '@react-navigation/native';
import usePartnerStore from '../../../store/partnerStore';
// import useUserStore from '../../../store/userStore';

const NoDataCard = () => {
  const navigation = useNavigation();
  const {partnerName} = usePartnerStore();
  
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <View style={styles.illustrationContainer}>
          <View style={styles.imageBackground} />
          <Image style={styles.image} resizeMode='cover' source={require('@assets/images/RoutineEmpty.png')} />
        </View>
        <Text style={styles.message}>{partnerName} 님의 할 일 등록을 기다리고 있어요!</Text>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTodoForm')}>
          {/* <Iconcontainer1 width={28} height={28} style={styles.icon} /> */}
          <Text style={styles.addButtonText}>할 일 추가하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoDataCard;

const styles = StyleSheet.create({
  cardWrapper: {
    // borderRadius: 14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: Colors.customWhite,
    shadowColor: Colors.gray7,
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
    paddingVertical: Padding.p_30,
    alignItems: 'center',
    gap: Gap.gap_20,
  },
  card: {
    alignItems: 'center',
    gap: Gap.gap_20,
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    position: 'relative',
  },
  imageBackground: {
    backgroundColor: Colors.gray2,
    borderRadius: 999,
    position: 'absolute',
    width: 160,
    height: 160,
  },
  image: {
    position: 'absolute',
    top: 32,
    left: 20,
    width: 120,
    height: 96,
  },
  message: {
    width: '200',
    fontSize: FontSize.size_20,
    lineHeight: 32,
    fontWeight: '500',
    color: Colors.customBlack,
    textAlign: 'center',
    letterSpacing: -0.7,
    fontFamily: FontFamily.pretendardVariable,
  },
  addButtonContainer: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_8,
  },
  icon: {
    borderRadius: BorderRadius.br_20,
  },
  addButtonText: {
    fontSize: FontSize.size_16,
    lineHeight: 26,
    fontWeight: '600',
    color: Colors.customBlack,
    fontFamily: FontFamily.pretendardVariable,
  },
});
