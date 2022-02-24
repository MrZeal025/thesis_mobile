import React, { useState, useEffect } from 'react';
// native components
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, SafeAreaView, Modal, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
// import * as yup from 'yup';
import { Formik } from 'formik';
import { AntDesign } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
// stylesheet
import { formsContainer, displayFormContainer, landingPagesOrientation, checkBox } from '../../styles/styles-screens';
// custom components
import KeyboardAvoidingWrapper from '../../_utils/KeyboardAvoidingWrapper';
import CustomInputs from '../../_utils/CustomInputs';
import CustomButton from '../../_utils/CustomButton';
import { Colors } from '../../styles/styles-colors';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { _setThisPageToCompleted } from '../../_storages/_state_process';
import { updateUserType } from '../../apis/users';

const ProfileScreen = () => {
  // default states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [prevInfo, setPrevInfo] = useState({});
  const [qrCodeID, setQRCodeID] = useState('');

  const setUserTypeChoice = type => {
    setPrevInfo({ ...prevInfo, userType: type });
  };

  const overRideHandlerChange = (field, value) => {
    setPrevInfo({ ...prevInfo, [field]: value });
  };

  const getUserProfileData = async () => {
    // get the stored data and render to the fields
    try {
      const data = await AsyncStorage.getItem('@profileInfo');
      const value = await AsyncStorage.getItem('@mobile_num_key');
      const newdata = JSON.parse(data);
      setPrevInfo({ mobileNumber: value, ...newdata });
    } catch (error) {
      console.log(error);
    }
  };

  const _getGeneratedQRId = async () => {
    try {
      // fetch the user random id saved on the mobile data
      const value = await AsyncStorage.getItem('@userRandomeQRID');
      // checks if there is a saved data
      if (value !== null) {
        // value previously stored
        setQRCodeID(value);
      }
    } catch (error) {
      // error reading value
      setQRCodeID('');
    }
  };

  // this function is a react native lifecycle method that will run when a component is mounted / loaded
  useEffect(() => {
    _getGeneratedQRId();
    // running this function on mount
    getUserProfileData();
  }, []);

  const updateUserTypeFunction = async () => {
    try {
      await updateUserType({ userType: prevInfo.userType }, qrCodeID);
      _setThisPageToCompleted('@profileInfo', JSON.stringify(prevInfo));
      setModalConfirmVisible(!modalConfirmVisible);
      showSuccessAlert();
    } catch (error) {
      console.log(error);
    }
  };

  const renderStudentFields = ({ prevInfo, errors, overRideHandlerChange, handleBlur, touched }) => {
    return (
      <>
        <CustomInputs
          labelTitle="Student Number"
          required={true}
          onChangeText={e => overRideHandlerChange('studentNumber', e)}
          placeHolder=""
          onBlur={handleBlur('studentNumber')}
          value={prevInfo.studentNumber}
        />
        {errors.studentNumber && touched.studentNumber && (
          <Text style={formsContainer.errorMessage}>{errors.studentNumber}</Text>
        )}
        <CustomInputs
          labelTitle="College Department"
          required={true}
          onChangeText={e => overRideHandlerChange('collegeDepartment', e)}
          placeHolder=""
          onBlur={handleBlur('collegeDepartment')}
          value={prevInfo.collegeDepartment}
        />
        {errors.collegeDepartment && touched.collegeDepartment && (
          <Text style={formsContainer.errorMessage}>{errors.collegeDepartment}</Text>
        )}
      </>
    );
  };

  const renderFacultyFields = ({ prevInfo, errors, overRideHandlerChange, handleBlur, touched }) => {
    return (
      <>
        <CustomInputs
          labelTitle="Faculty Position"
          required={true}
          onChangeText={e => overRideHandlerChange('facultyPosition', e)}
          placeHolder=""
          onBlur={handleBlur('facultyPosition')}
          value={prevInfo.facultyPosition}
        />
        {errors.facultyPosition && touched.facultyPosition && (
          <Text style={formsContainer.errorMessage}>{errors.facultyPosition}</Text>
        )}
        <CustomInputs
          labelTitle="College Department"
          required={true}
          onChangeText={e => overRideHandlerChange('collegeDepartment', e)}
          placeHolder=""
          onBlur={handleBlur('collegeDepartment')}
          value={prevInfo.collegeDepartment}
        />
        {errors.collegeDepartment && touched.collegeDepartment && (
          <Text style={formsContainer.errorMessage}>{errors.collegeDepartment}</Text>
        )}
      </>
    );
  };

  const renderWorkerFields = ({ prevInfo, errors, overRideHandlerChange, handleBlur, touched }) => {
    return (
      <>
        <CustomInputs
          labelTitle="Job Title"
          required={true}
          onChangeText={e => overRideHandlerChange('jobTitle', e)}
          placeHolder=""
          onBlur={handleBlur('jobTitle')}
          value={prevInfo.jobTitle}
        />
        {errors.jobTitle && touched.jobTitle && <Text style={formsContainer.errorMessage}>{errors.jobTitle}</Text>}
      </>
    );
  };

  const showSuccessAlert = () => {
    Alert.alert(
      'Success',
      'Profile changes was saved successfully on your device.',
      [
        {
          text: 'Close',
          style: 'default',
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <SafeAreaView style={landingPagesOrientation.container}>
          <Text style={displayFormContainer.formsHeader}>Profile Information Summary</Text>
          <Formik
            initialValues={prevInfo}
            validateOnMount={true}
            //validationSchema={personalInfoSchema}
            onSubmit={() => {
              setModalConfirmVisible(true);
            }}
          >
            {({ handleBlur, handleSubmit, errors, touched, values }) => (
              <View style={{ marginTop: 10 }}>
                <View style={{ marginBottom: 15 }}>
                  <Text style={displayFormContainer.formCaptions}>User Affiliation</Text>
                  <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                    <View style={[displayFormContainer.flexContainer]}>
                      <Text>{prevInfo.userType}</Text>
                      <AntDesign name="caretdown" size={14} color="black" />
                    </View>
                  </TouchableOpacity>
                  {prevInfo.userType === 'Student' &&
                    renderStudentFields({ prevInfo, errors, overRideHandlerChange, handleBlur, touched })}
                  {prevInfo.userType === 'Faculty' &&
                    renderFacultyFields({ prevInfo, errors, overRideHandlerChange, handleBlur, touched })}
                  {prevInfo.userType === 'Worker' &&
                    renderWorkerFields({ prevInfo, errors, overRideHandlerChange, handleBlur, touched })}
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Text style={displayFormContainer.formCaptions}>Personal Name</Text>
                  <CustomInputs
                    labelTitle="First name"
                    required={true}
                    onChangeText={e => overRideHandlerChange('firstName', e)}
                    placeHolder=""
                    onBlur={handleBlur('firstName')}
                    value={prevInfo.firstName}
                  />
                  {errors.firstName && touched.firstName && (
                    <Text style={formsContainer.errorMessage}>{errors.firstName}</Text>
                  )}
                  <CustomInputs
                    labelTitle="Middle name"
                    required={false}
                    onChangeText={e => overRideHandlerChange('middleName', e)}
                    placeHolder=""
                    onBlur={handleBlur('middleName')}
                    value={prevInfo.middleName}
                  />
                  {errors.middleName && touched.middleName && (
                    <Text style={formsContainer.errorMessage}>{errors.middleName}</Text>
                  )}
                  <CustomInputs
                    labelTitle="Last name"
                    required={true}
                    onChangeText={e => overRideHandlerChange('lastName', e)}
                    placeHolder=""
                    onBlur={handleBlur('lastName')}
                    value={prevInfo.lastName}
                  />
                  {errors.lastName && touched.lastName && (
                    <Text style={formsContainer.errorMessage}>{errors.lastName}</Text>
                  )}
                  <CustomInputs
                    labelTitle="Suffix"
                    required={false}
                    onChangeText={e => overRideHandlerChange('nameExtension', e)}
                    placeHolder=""
                    onBlur={handleBlur('nameExtension')}
                    value={prevInfo.nameExtension}
                  />
                  {errors.nameExtension && touched.nameExtension && (
                    <Text style={formsContainer.errorMessage}>{errors.nameExtension}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Text style={displayFormContainer.formCaptions}>Current Address</Text>
                  <CustomInputs
                    labelTitle="Lot Number"
                    required={false}
                    onChangeText={e => overRideHandlerChange('lotNumber', e)}
                    placeHolder=""
                    onBlur={handleBlur('firstName')}
                    value={prevInfo.lotNumber}
                  />
                  {errors.lotNumber && touched.lotNumber && (
                    <Text style={formsContainer.errorMessage}>{errors.lotNumber}</Text>
                  )}
                  <CustomInputs
                    labelTitle="Street Name"
                    required={true}
                    onChangeText={e => overRideHandlerChange('streetName', e)}
                    placeHolder=""
                    onBlur={handleBlur('streetName')}
                    value={prevInfo.streetName}
                  />
                  {errors.streetName && touched.streetName && (
                    <Text style={formsContainer.errorMessage}>{errors.streetName}</Text>
                  )}
                  <CustomInputs
                    labelTitle="District / Subdivision"
                    required={false}
                    onChangeText={e => overRideHandlerChange('district', e)}
                    placeHolder=""
                    onBlur={handleBlur('district')}
                    value={prevInfo.district}
                  />
                  {errors.district && touched.district && (
                    <Text style={formsContainer.errorMessage}>{errors.district}</Text>
                  )}
                  <CustomInputs
                    labelTitle="Barangay"
                    required={true}
                    onChangeText={e => overRideHandlerChange('barangay', e)}
                    placeHolder=""
                    onBlur={handleBlur('barangay')}
                    value={prevInfo.barangay}
                  />
                  {errors.barangay && touched.barangay && (
                    <Text style={formsContainer.errorMessage}>{errors.barangay}</Text>
                  )}
                  <CustomInputs
                    labelTitle="City"
                    required={true}
                    onChangeText={e => overRideHandlerChange('city', e)}
                    placeHolder=""
                    onBlur={handleBlur('city')}
                    value={prevInfo.city}
                  />
                  {errors.city && touched.city && <Text style={formsContainer.errorMessage}>{errors.city}</Text>}
                  <CustomInputs
                    labelTitle="Province"
                    required={true}
                    onChangeText={e => overRideHandlerChange('province', e)}
                    placeHolder=""
                    onBlur={handleBlur('province')}
                    value={prevInfo.province}
                  />
                  {errors.province && touched.province && (
                    <Text style={formsContainer.errorMessage}>{errors.province}</Text>
                  )}
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Text style={displayFormContainer.formCaptions}>Contact Information</Text>
                  <CustomInputs
                    labelTitle="Mobile Number"
                    required={true}
                    onChangeText={e => overRideHandlerChange('mobileNumber', e)}
                    placeHolder=""
                    onBlur={handleBlur('mobileNumber')}
                    value={prevInfo.mobileNumber}
                  />
                  {errors.mobileNumber && touched.mobileNumber && (
                    <Text style={formsContainer.errorMessage}>{errors.mobileNumber}</Text>
                  )}
                </View>
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                  <CustomButton color={Colors.primary} textColor="white" onPress={handleSubmit} title="Update" />
                </View>
              </View>
            )}
          </Formik>
          {/* option modal for changing user affiliation */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.modalText}>Change user affiliation?</Text>
                  <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={{ color: 'black' }}>
                      <FontAwesome name="times" color="black" size={22} />
                    </Text>
                  </Pressable>
                </View>
                <CheckBox
                  checked={prevInfo.userType === 'Student'}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor={Colors.primary}
                  onPress={() => setUserTypeChoice('Student')}
                  containerStyle={checkBox.radioOptions}
                  title="Student"
                />
                <CheckBox
                  checked={prevInfo.userType === 'Faculty'}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor={Colors.primary}
                  onPress={() => setUserTypeChoice('Faculty')}
                  containerStyle={checkBox.radioOptions}
                  title="Faculty"
                />
                <CheckBox
                  checked={prevInfo.userType === 'Worker'}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor={Colors.primary}
                  onPress={() => setUserTypeChoice('Worker')}
                  containerStyle={checkBox.radioOptions}
                  title="Worker"
                />
                <CheckBox
                  checked={prevInfo.userType === 'Visitor / Guest'}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor={Colors.primary}
                  onPress={() => setUserTypeChoice('Visitor / Guest')}
                  containerStyle={checkBox.radioOptions}
                  title="Visitor / Guest"
                />
              </View>
            </View>
          </Modal>
          {/* confirm modal for saving the data */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalConfirmVisible}
            onRequestClose={() => {
              setModalConfirmVisible(!modalConfirmVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={[styles.modalView]}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.modalText}>Do you want to save the changes?</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 15,
                  }}
                >
                  <TouchableOpacity
                    style={{ width: '50%' }}
                    onPress={() => setModalConfirmVisible(!modalConfirmVisible)}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.lightGrey,
                        height: 50,
                        justifyContent: 'center',
                        marginRight: 10,
                        alignItems: 'center',
                        borderRadius: 3,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '700' }}>No</Text>
                    </View>
                  </TouchableOpacity>
                  {/* yes button */}
                  <TouchableOpacity
                    style={{ width: '50%' }}
                    onPress={() => {
                      updateUserTypeFunction();
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.accent,
                        height: 50,
                        marginLeft: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 3,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>Yes</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000000AA',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 7,
    padding: 35,
    alignItems: 'center',
    shadowColor: Colors.primary,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '700',
    width: '100%',
  },
});

export default ProfileScreen;
