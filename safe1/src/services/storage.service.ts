import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY: string = "@safe1:user";

class StorageService {
  async setUser(user: any) {
    try {
      if (user !== null) {
        const decodedUser = JSON.stringify(user);
        await AsyncStorage.setItem(USER_STORAGE_KEY, decodedUser);
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (err) {
      console.log(`Error setting user from AsyncStorage: ${err}`);
    }  
  }

  async getUser(): Promise<any> {
    try {
      const decodedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return decodedUser != null ? JSON.parse(decodedUser) : null;
    } catch (err) {
      console.log(`Error getting user from AsyncStorage: ${err}`);
    }  
  }
};

export default new StorageService();