import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRouter, Stack } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  moderateScale as ms,
  widthPercentageToDP as wp
} from '../Utils/LayoutMeasurement';
import { colors, strings } from "../constants/index"
import { getAddresses } from '../db/database';
import { AntDesign } from '@expo/vector-icons';

const Address = () => {
  const router = useRouter();
  const navigation = useNavigation();

  // Function for logout user
  useLayoutEffect(() => {
    const handleLogout = async () => {
      try {
        await AsyncStorage.clear();
        router.replace('/');
      } catch (err) {
        console.error('[Address] logout error:', err);
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
          style={{ marginRight: 12 }}
        >
          <AntDesign name="poweroff" size={22} color={colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [list, setList] = useState([]);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Load address data from the db
  const loadData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('@auth_user_id');
      if (!storedUserId) {
        router.dismissAll();
        router.replace('/');
        return;
      }

      setUserId(storedUserId);

      const addresses = await getAddresses();
      setList(addresses);
    } catch (error) {
      console.error('[ADDRESS] Load error:', error);
    }
  };

  // For displaying address list
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: '/AddressDetail',
          params: item,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.name}>{item.email}</Text>
      <Text style={styles.name}>{item.contact}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'AddressBook', }} />
      <View style={styles.mainContainer}>

        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: hp(10) }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/AddressDetail')}
        >
          <FontAwesome6 name="add" size={24} color={colors.white} />
        </TouchableOpacity>

      </View>
    </>
  );
};

export default Address;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  item: {
    padding: hp(2),
    borderBottomWidth: 1,
    borderColor: colors.borderBottomLine,
    marginHorizontal: wp(2)
  },
  name: {
    fontSize: ms(15)
  },
  fab: {
    position: 'absolute',
    bottom: hp(4),
    right: wp(6),
    width: hp(7),
    height: hp(7),
    borderRadius: hp(3.5),
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 10,
  },
});