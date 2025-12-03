import React, {useEffect} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import vexo from './src/services/analytics';

export default function App() {
  useEffect(() => {
    vexo.track('App_Started', {platform: 'web'});
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
