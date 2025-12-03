import React, {useState, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {showError, showSuccess} from '../utils/toast';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      showSuccess('Login successful');
    } catch (error) {
      showError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.logo}>💎</Text>
        <Text style={s.title}>GemTrack</Text>
      </View>
      
      <View style={s.form}>
        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor="#71717A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={s.input}
          placeholder="Password"
          placeholderTextColor="#71717A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        
        <TouchableOpacity style={s.btn} onPress={handleLogin}>
          <Text style={s.btnText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={s.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0A0A0B', justifyContent: 'center', paddingHorizontal: 24},
  header: {alignItems: 'center', marginBottom: 60},
  logo: {fontSize: 48, marginBottom: 16},
  title: {fontSize: 28, fontWeight: '700', color: '#D4AF37', letterSpacing: 1},
  form: {width: '100%'},
  input: {backgroundColor: '#141416', padding: 18, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#27272A', color: '#FFFFFF', marginBottom: 16},
  btn: {backgroundColor: '#D4AF37', padding: 18, borderRadius: 12, marginTop: 8},
  btnText: {color: '#0A0A0B', textAlign: 'center', fontSize: 16, fontWeight: '700'},
  link: {color: '#A1A1AA', textAlign: 'center', marginTop: 24, fontSize: 15},
});
