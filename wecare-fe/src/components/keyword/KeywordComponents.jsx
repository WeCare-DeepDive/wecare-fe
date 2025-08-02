import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../styles/theme';

const KeywordComponent = ({ 
  keyword, 
  badge,
  keywordId,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.keywordContainer]}
      onPress={() => onPress(keyword)}
      activeOpacity={0.7}
    >
      <Text style={[styles.keyword, isSelected && styles.selectedKeyword]}>{keyword}</Text>
      {badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default KeywordComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.customWhite || '#fff',
  },
  keywordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Theme.Colors.customWhite || '#fff',
    borderWidth: 2,
    borderColor: Theme.Colors.gray6,
    borderRadius: 14,
  },
  keyword: {
    // fontSize: 16,
    // fontWeight: 'bold',
    marginRight: 4,
  },
  badgeContainer: {
    backgroundColor: Theme.Colors.yellow500 || '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badge: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedKeyword:{
    color: Theme.Colors.purple500,
    fontWeight: 'bold',
  }
});
