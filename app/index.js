import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    heightPercentageToDP as hp,
    moderateScale as ms,
    widthPercentageToDP as wp,
} from '../Utils/LayoutMeasurement';
import { colors, strings } from "../constants/index"

// sqlite import
import * as Crypto from 'expo-crypto';
import { createUser, getUserByEmail } from '../db/database';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // login and validation function
    const validateAndLogin = async () => {
        if (!email.trim()) {
            Alert.alert(strings.Label_Validation_Error, strings.Label_Email_Require);
            return;
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email)) {
            Alert.alert(strings.Label_Validation_Error, strings.Label_Email_Validation);
            return;
        }

        if (!password) {
            Alert.alert(strings.Label_Validation_Error, strings.Label_Password_Require);
            return;
        }

        const passwordRegex =
            /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,}$/;

        if (!passwordRegex.test(password)) {
            Alert.alert(strings.Label_Validation_Error, strings.Label_Password_Validation);
            return;
        }

        try {
            // db function to get user
            const user = await getUserByEmail(email);
            let userId;

            if (user) {
                userId = user.id;
            } else {
                userId = Crypto.randomUUID();
                await createUser(userId, email, password);
            }

            await AsyncStorage.setItem('@auth_logged_in', 'true');
            await AsyncStorage.setItem('@auth_email', email);
            await AsyncStorage.setItem('@auth_user_id', userId);

            setEmail('');
            setPassword('');
            router.replace('/Address');
        } catch (error) {
            console.error('[LOGIN] Error:', error);
            Alert.alert('Error', 'Login failed');
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Login', headerBackVisible: false }} />
            <SafeAreaView style={styles.mainContainer}>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10} >

                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 90 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false} >

                        <View style={styles.contentContainer}>
                            <View style={styles.emailContainer}>
                                <Text style={styles.label}>{strings.Label_Email}</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.passwordInputContainer}>
                                <Text style={styles.label}>{strings.Label_Password}</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={styles.input}
                                />
                            </View>

                            <TouchableOpacity style={styles.button} onPress={validateAndLogin}>
                                <Text style={styles.buttonText}>{strings.Label_LogIn}</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default Login;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    contentContainer: {
        marginTop: hp(10), 
        marginHorizontal: wp(8)
    },
    emailContainer: {
        marginBottom: hp(2)
    },
    label: {
        color: colors.textColor,
        fontSize: ms(16),
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        color: colors.textColor,
        fontSize: ms(16),
        paddingVertical: hp(1),
    },
    passwordInputContainer: {
        marginBottom: hp(2),
        marginTop: hp(2)
    },
    button: {
        marginTop: hp(6),
        backgroundColor: colors.backgroundColor,
        padding: hp(2),
        borderRadius: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: ms(16),
        textAlign: 'center',
        fontWeight: "500"
    },
});

