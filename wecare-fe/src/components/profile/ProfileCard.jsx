import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { useAuthStore } from '../../store/authStore';
import { Theme } from '../../styles/theme'; // Theme import 추가
import { relationshipTypeKo } from '../../constants/relationConstants';

const ProfileCard = ({
  relation = [],
  role,
}) => {
  // const { role } = useAuthStore();

  // 프로필 이미지 처리
  // const profileImage = role === 'DEPENDENT' ? require('@assets/images/ProfileDependent.png') : require('@assets/images/ProfileProtector.png');
  const profileImage = require('@assets/images/ProfileDependent.png');
  console.log('🔍 ProfileCard 에서 relation', relation);
  
  // 관계 타입 처리
  const relationType = relationshipTypeKo[relation[0].relationshipType];
  console.log('🔍 relationType', relationType);

  return (
    <View style={styles.container}>
      {/* 프로필 */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <View style={styles.profileImageBg}>
            <Image
              source={profileImage}
              style={styles.profileImage}
            />
          </View>
          <TouchableOpacity style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>{relation[0].partnerName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{relationType}</Text>
          </View>
        </View>
      </View>

      {/* 레벨바 */}
      <View style={styles.levelContainer}>
        <View style={styles.levelLabels}>
          <Text style={styles.levelText}>Lv. 6</Text>
          <Text style={styles.levelText}>Lv. 8</Text>
        </View>
        <View style={styles.progressWrapper}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
            <View style={styles.progressHandle} />
          </View>
        </View>
        <View style={styles.currentLevelWrapper}>
          <Text style={styles.currentLevelText}>Lv. 7</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    // borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    // margin: 16,
    // marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageBg: {
    // width: 100,
    // height: 100,
    borderRadius: 50,
    // backgroundColor: Theme.Colors.purple500,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  plusButton: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: Theme.Colors.purple500,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderColor: '#fff',
  },
  plusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: Theme.Colors.purple500,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  levelContainer: {
    width: '100%',
    alignItems: 'center',
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  progressWrapper: {
    width: '100%',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: Theme.Colors.purple500,
    borderRadius: 4,
  },
  progressHandle: {
    position: 'absolute',
    left: '50%',
    top: -4,
    marginLeft: -8,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Theme.Colors.purple500,
  },
  currentLevelWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  currentLevelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileCard;