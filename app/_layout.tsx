import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
  LogBox,
} from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

// It will remove the unnecessary warning/dev logs
LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('@auth_user_id');
      setUserId(stored || null);
    };
    load();
  }, []);

  useEffect(() => {
    if (userId) {
      router.replace("/Address");
    }
  }, [userId]);

  if (userId === undefined) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#238080" />
        <StatusBar style="light" />
      </View>
    );
  }

  // Function for logout user
  const handleLogout = async () => {
    await AsyncStorage.clear();
    setUserId(null);
    router.replace('/');
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={() =>
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: handleLogout },
        ])
      }
      style={{ marginRight: 12 }} >
      <AntDesign name="poweroff" size={22} color="#ffffff" />
    </TouchableOpacity>
  );

  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#238080' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600', color: '#ffffff' },
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >

        {!userId && (
          <Stack.Screen
            name="index"
            options={{
              headerTitle: 'Login',
              headerShown: true,
              headerBackVisible: false,
            }}
          />
        )}

        {userId && (
          <>
            <Stack.Screen
              name="Address"
              options={{
                headerTitle: 'AddressBook',
                headerShown: true,
                headerBackVisible: false,
                headerRight: () => <LogoutButton />,
              }}
            />

            <Stack.Screen
              name="AddressDetail"
              options={{
                headerTitle: 'Details',
                headerShown: true,
                headerBackButtonDisplayMode: 'minimal',
                headerRight: () => <LogoutButton />,
              }}
            />
          </>
        )}
      </Stack>

      <StatusBar style="light" />
    </KeyboardProvider>
  );
}