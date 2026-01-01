import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter, Stack } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  moderateScale as ms,
  widthPercentageToDP as wp,
} from '../Utils/LayoutMeasurement';
import { colors, strings } from "../constants/index"
import {
  deleteAddress as deleteAddressFromDB,
  insertAddress,
  updateAddress,
} from '../db/database';
import { AntDesign } from '@expo/vector-icons';

const AddressDetail = () => {
  const params = useLocalSearchParams();
  const isEdit = Boolean(params?.id);

  const router = useRouter();
  const navigation = useNavigation();

  // Function for logout user 
  useLayoutEffect(() => {
    const handleLogout = async () => {
      try {
        await AsyncStorage.clear();
        router.dismissAll()
        router.replace('/');
      } catch (err) {
        console.error('[AddressDetail] logout error:', err);
      }
    };

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(strings.Label_Logout, strings.Label_Logout_Warning, [
              { text: strings.Label_Cancel, style: 'cancel' },
              { text: strings.Label_Logout, onPress: handleLogout },
            ])
          }
          style={styles.headerLogoutStyle}
        >
          <AntDesign name="poweroff" size={22} color={colors.white} />
        </TouchableOpacity>
      ),
    });

  }, [navigation]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userId, setUserId] = useState(null);

  // Pouplate data and check the session
  useEffect(() => {
    const init = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('@auth_user_id');

        if (!storedUserId) {
          Alert.alert(strings.Label_Error, strings.Label_User_Error);
          router.dismissAll();
          router.replace('/');
          return;
        }
        setUserId(storedUserId);
        if (isEdit) {
          setName(params.name || '');
          setEmail(params.email || '');
          setContactNumber(params.contact || '');
        }
      } catch (error) {
        console.error('[ADDRESS DETAIL] Init error:', error);
      }
    };

    init();
  }, [isEdit]);

  // Function for updating & inserting address
  const saveAddress = async () => {
    if (!name.trim()) {
      Alert.alert(strings.Label_Validation_Error, strings.Label_Name_Require);
      return;
    }

    if (!email.trim()) {
      Alert.alert(strings.Label_Validation_Error, strings.Label_Email_Require);
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      Alert.alert(strings.Label_Validation_Error, strings.Label_Email_Validation);
      return;
    }

    if (!contactNumber.trim()) {
      Alert.alert(strings.Label_Validation_Error, strings.Label_Contact_Require);
      return;
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contactNumber)) {
      Alert.alert(strings.Label_Validation_Error, strings.Label_Contact_Validation);
      return;
    }

    try {
      if (isEdit) {
        await updateAddress(params.id, name, email, contactNumber);
      } else {
        await insertAddress(name, email, contactNumber);
      }

      router.back();
    } catch (error) {
      console.error('[ADDRESS DETAIL] Save error:', error);
      Alert.alert(strings.Label_Error, strings.Label_failed_Save_Address);
    }
  };

  // For deleting the address
  const handleDelete = async () => {
    Alert.alert(
      strings.Label_Delete_Address,
      strings.Label_Delete_Address_Warning, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAddressFromDB(params.id);
            router.back();
          } catch (error) {
            console.error('[ADDRESS DETAIL] Delete error:', error);
            Alert.alert(strings.Label_Error, strings.Label_failed_To_delete_Address);
          }
        },
      },
    ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Details', headerBackButtonDisplayMode: 'minimal', }} />
      <SafeAreaView style={styles.mainContainer}>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10} >

          <ScrollView
            contentContainerStyle={styles.scrollViewContentContainerStyle}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false} >

            <View style={styles.contentContainerScreen}>
              <View style={styles.nameContainer}>
                <Text style={styles.label}>{strings.Label_Name}</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputLabelContainer}>
                <Text style={styles.label}>{strings.Label_Email}</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputLabelContainer}>
                <Text style={styles.label}>{strings.Label_Contact_Number}</Text>
                <TextInput
                  value={contactNumber}
                  onChangeText={text =>
                    setContactNumber(text.replace(/[^0-9]/g, '').slice(0, 10))
                  }
                  keyboardType="number-pad"
                  maxLength={10}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={saveAddress}>
                <Text style={styles.primaryButtonText}>
                  {isEdit ? strings.Label_Update : strings.Label_Insert}
                </Text>
              </TouchableOpacity>

              {isEdit && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>{strings.Label_Delete}</Text>
                </TouchableOpacity>
              )}

            </View>
          </ScrollView>

        </KeyboardAvoidingView>

      </SafeAreaView>
    </>
  );
};

export default AddressDetail;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: hp(3),
    backgroundColor: colors.white,
  },
  scrollViewContentContainerStyle: {
    paddingBottom: 90
  },
  contentContainerScreen: {
    marginHorizontal: wp(2)
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
    marginBottom: hp(3),
    paddingVertical: hp(1),
    fontSize: ms(14),
  },
  nameContainer: {
    marginBottom: hp(1)
  },
  label: {
    color: colors.textColor,
    fontSize: ms(14),
  },
  primaryButton: {
    backgroundColor: colors.backgroundColor,
    padding: hp(2),
    borderRadius: 8,
    marginTop: hp(4),
  },
  primaryButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputLabelContainer: {
    marginBottom: hp(1)
  },
  headerLogoutStyle: {
    marginRight: 12
  },
  deleteButton: {
    backgroundColor: colors.backgroundColor,
    padding: hp(2),
    borderRadius: 8,
    marginTop: hp(2),
  },
  deleteButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});