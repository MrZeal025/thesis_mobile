import React, { useEffect, useState, useRef } from 'react';
// native components
import { Text, SafeAreaView, View, TextInput } from 'react-native';
import { Colors } from '../../styles/styles-colors';
import { Feather } from '@expo/vector-icons';
import { checkInternetConnection } from '../../_utils/CheckIfConnectedToInternet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { _setThisPageToCompleted } from '../../_storages/_state_process';
// stylesheet
import { landingPagesOrientation, buttonOrientation } from '../../styles/styles-screens';
// components
import CustomButton from '../../_utils/CustomButton';

const OTPConfirmationScreen = ({ navigation }) => {
  // default values
  const [connectedToNet, setConnectedToNet] = useState(false);
  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  const firstDigitRef = useRef(null);
  const secondDigitRef = useRef(null);
  const thirdDigitRef = useRef(null);
  const fourthDigitRef = useRef(null);

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
    checkInternetConnection().then(res => setConnectedToNet(res));
    connectedToNet && firstDigitRef.current.focus();
    _readStoredNumber();
  }, []);

  /**
   * This will re send the otp function by recalling it
   */
  const sendOTP = async () => {
    console.log('Sending OTP');
  };

  const verifyOTP = async () => {
    const connectionStatus = await checkInternetConnection();
    if (connectionStatus) {
      // insert here the verification code block for the OTP
      if (firstDigit !== '' && secondDigit !== '' && thirdDigit !== '' && fourthDigit !== '') {
        // this will set the "set up status" of the application to complete for the landing pages
        _setThisPageToCompleted('@otpPageSuccessful', 'true');
        // move to the landing screen
        navigation.navigate('MainPages');
      } else {
        setError(`Enter the 4 digit verification code sent to ${mobileNumber}.`);
      }
    } else {
      setConnectedToNet(false);
    }
  };

  return (
    <SafeAreaView style={[landingPagesOrientation.container]}>
      {connectedToNet && (
        <>
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
          <View
            style={[landingPagesOrientation.inputContainer, { justifyContent: 'space-around', flexDirection: 'row' }]}
          >
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
          {error !== '' && (
            <Text style={{ color: Colors.red, marginLeft: 20, marginTop: 10, marginBottom: 10 }}>{error}</Text>
          )}
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 18 }}>
            Didn't receive the code?{' '}
            <Text style={landingPagesOrientation.resendLink} onPress={() => sendOTP()}>
              Request again.
            </Text>
          </Text>
        </>
      )}
      {!connectedToNet && (
        <View
          style={[
            landingPagesOrientation.textContainer,
            landingPagesOrientation.textContaineredCenter,
            landingPagesOrientation.otpContianer,
            {
              marginTop: '60%',
            },
          ]}
        >
          <Feather name="wifi-off" size={90} color={Colors.primary} />
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 17, fontWeight: '700' }}>
            Please make sure that you are connected to a stable internet connection in order to continue.
          </Text>
        </View>
      )}

      <View style={buttonOrientation.landingButtonOrientation}>
        {connectedToNet && (
          <CustomButton
            title="Verify and Continue"
            color={Colors.primary}
            textColor="white"
            onPress={() => verifyOTP()}
          />
        )}
        {!connectedToNet && (
          <CustomButton
            title="Reload page"
            color={'grey'}
            textColor={Colors.lightGrey}
            onPress={() => checkInternetConnection().then(res => setConnectedToNet(res))}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OTPConfirmationScreen;
