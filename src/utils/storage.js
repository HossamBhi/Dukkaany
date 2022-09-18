import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCATION_KEY = "Dukkaany:Location";

export const setLocationStorage = (data) =>
  AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(data));

export const getLocationStorage = async () => {
  const value = await AsyncStorage.getItem(LOCATION_KEY);
  return value != null ? JSON.parse(value) : null;
};

export const removeAsyncStorage = () => AsyncStorage.clear();
