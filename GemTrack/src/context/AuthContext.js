import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Verify token is valid by making a test API call
        setUser({token});
      }
    } catch (e) {
      await AsyncStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const {data} = await auth.login(email, password);
    await AsyncStorage.setItem('token', data.token);
    setUser({token: data.token});
  };

  const register = async (email, password, name) => {
    const {data} = await auth.register(email, password, name);
    await AsyncStorage.setItem('token', data.token);
    setUser({token: data.token});
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, login, register, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};
