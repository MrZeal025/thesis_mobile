import React, { useEffect, useState, useRef } from 'react';
// native components
import { Text, SafeAreaView, View, TextInput } from 'react-native';
import { Colors } from '../../styles/styles-colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// stylesheet
import { landingPagesOrientation, buttonOrientation } from '../../styles/styles-screens';
// components
import CustomButton from '../../_utils/CustomButton';

const OTPConfirmationScreen = ({ navigation }: any) => {
  // default values
  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const firstDigitRef: any = useRef(null);
  const secondDigitRef: any = useRef(null);
  const thirdDigitRef: any = useRef(null);
  const fourthDigitRef: any = useRef(null);

  const _readStoredNumber = async () => {
    try {
      const value = await AsyncStorage.getItem('@mobile_num_key');
      if (value !== null) {
        // value previously stored
        setMobileNumber(value);
      }
    } catch (error) {
      // error reading value
      setMobileNumber('');
      console.log(error);
    }
  };

  useEffect(() => {
    // read and get the local number stored in the async storage
    firstDigitRef.current.focus();
    _readStoredNumber();
  }, []);

  /**
   * This will re send the otp function by recalling it
   */
  const sendOTP = () => {
    console.log('Sending OTP');
  };

  return (
    <SafeAreaView style={[landingPagesOrientation.container]}>
      <View
        style={[
          landingPagesOrientation.textContainer,
          landingPagesOrientation.textContaineredCenter,
          landingPagesOrientation.otpContianer,
        ]}
      >
        <Feather name="smartphone" size={90} color={Colors.primary} />
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 18 }}>
          Code is sent to <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>{mobileNumber}</Text>
        </Text>
      </View>
      <View style={[landingPagesOrientation.inputContainer, { justifyContent: 'space-around', flexDirection: 'row' }]}>
        <TextInput
          ref={firstDigitRef}
          style={landingPagesOrientation.otpInput}
          onChangeText={e => {
            setFirstDigit(e);
            secondDigitRef.current.focus();
          }}
          value={firstDigit}
          maxLength={1}
          keyboardType="numeric"
        />
        <TextInput
          ref={secondDigitRef}
          style={landingPagesOrientation.otpInput}
          onChangeText={e => {
            setSecondDigit(e);
            thirdDigitRef.current.focus();
          }}
          value={secondDigit}
          maxLength={1}
          keyboardType="numeric"
        />
        <TextInput
          ref={thirdDigitRef}
          style={landingPagesOrientation.otpInput}
          onChangeText={e => {
            setThirdDigit(e);
            fourthDigitRef.current.focus();
          }}
          value={thirdDigit}
          maxLength={1}
          keyboardType="numeric"
        />
        <TextInput
          ref={fourthDigitRef}
          style={landingPagesOrientation.otpInput}
          onChangeText={e => {
            setFourthDigit(e);
          }}
          value={fourthDigit}
          maxLength={1}
          keyboardType="numeric"
        />
      </View>
      <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 18 }}>
        Didn't receive the code?{' '}
        <Text style={landingPagesOrientation.resendLink} onPress={() => sendOTP()}>
          Request again.
        </Text>
      </Text>
      <View style={buttonOrientation.landingButtonOrientation}>
        <CustomButton
          title="Verify and Continue"
          color={Colors.primary}
          textColor="white"
          onPress={() => navigation.navigate('MainPages')}
        />
      </View>
    </SafeAreaView>
  );
};

export default OTPConfirmationScreen;
