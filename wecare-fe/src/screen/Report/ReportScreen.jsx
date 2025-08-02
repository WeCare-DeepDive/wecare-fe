// screens/Home/HomeScreen.jsx
import React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, Dimensions } from 'react-native';
import PushAlertTestRN from '../Routine/components/PushAlertTestRN';

const screenWidth = Dimensions.get('window').width;

export default function ReportScreen() {
  return (
    <SafeAreaView testID="report-screen" style={{flex: 1, backgroundColor: '#fff' }}>
      {/* <PushAlertTestRN /> */}
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1, width: '100%', }}>
          <Image 
            source={require('@assets/images/Report1.png')} 
            style={{ width: screenWidth - 20, height: 400, resizeMode: 'contain', marginHorizontal: 10, marginTop: -80 }} 
          />
          <Image 
            source={require('@assets/images/Report2.png')} 
            style={{ width: screenWidth - 50, height: 550, resizeMode: 'stretch', marginHorizontal: 25, marginTop: -60 }} 
          />
          <Image 
            source={require('@assets/images/Report5.png')} 
            style={{ width: screenWidth - 50, height: 430, resizeMode: 'stretch', marginHorizontal: 25, marginTop: 20 }} 
          />
          <Image 
            source={require('@assets/images/Report6.png')} 
            style={{ width: screenWidth - 50, height: 270, resizeMode: 'stretch', marginHorizontal: 25, marginTop: 40 }} 
          />
          <Image 
            source={require('@assets/images/Report7.png')} 
            style={{ width: screenWidth - 50, height: 270, resizeMode: 'stretch', marginHorizontal: 25, marginTop: 40 }} 
          />
          <Image 
            source={require('@assets/images/Report4.png')} 
            style={{ width: screenWidth, height: 400, resizeMode: 'contain' }} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
