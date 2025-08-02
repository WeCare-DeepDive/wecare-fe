// ScheduleScreen.jsx
import * as React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { Padding, BorderRadius, Colors, Gap } from '../../styles/theme';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';

import { Theme } from '../../styles/theme';
import PushAlertTestRN from '../Routine/components/PushAlertTestRN';

const ScheduleScreen = () => {
  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.calendarContainer}>
        {/* <PushAlertTestRN /> */}
        <Image source={require('@assets/images/Schedule.png')} style={styles.schedule} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // 기존 스타일 코드 유지
  // Theme.js에 정의된 스타일 사용
  schedule: {
    // top: 587,
    left: 20,
    width: 372,
    gap: Gap.gap_20,
    alignItems: 'center',
    position: 'absolute',
  },
  cardsFlexBox: {
    padding: Padding.p_20,
    borderRadius: BorderRadius.br_10,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: Colors.colorWhite,
  },
  calendar: {
    width: 332,
    height: 271,
  },
  cardescardcalendar: {
    height: 375,
    gap: Gap.gap_20,
  },
  parent: {
    // top: 138,
    left: 19,
    width: 374,
    paddingBottom: 30,
    gap: Gap.gap_20,
    position: 'absolute',
  },
  scrollview: {
    maxWidth: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: Colors.colorWhite,
    // paddingTop: 100,
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.colorWhite,
  },
});

export default ScheduleScreen;
