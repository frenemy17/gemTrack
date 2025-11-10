import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';


const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};


const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};


const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Token deleted successfully');
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

export default {
  saveToken,
  getToken,
  deleteToken,
};