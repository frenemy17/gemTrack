import React, {useState, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {showError, showSuccess} from '../utils/toast';

export default function SignUpScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const {register} = useContext(AuthContext);

  const handleSignUp = async () => {
    if (password !== confirm) return showError('Passwords do not match');
    try {
      await register(email, password, name);
      showSuccess('Account created successfully');
    } catch (error) {
      showError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Create Account</Text>
        <TextInput style={s.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
        <TextInput style={s.input} placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry={true} />
        <TouchableOpacity style={s.btn} onPress={handleSignUp}>
          <Text style={s.btnText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0A0A0B'},
  title: {fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 40, color: '#D4AF37'},
  input: {backgroundColor: '#141416', padding: 18, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#27272A', color: '#FFFFFF'},
  btn: {backgroundColor: '#D4AF37', padding: 18, borderRadius: 12, marginTop: 8},
  btnText: {color: '#0A0A0B', textAlign: 'center', fontSize: 16, fontWeight: '700'},
  link: {color: '#A1A1AA', textAlign: 'center', marginTop: 24, fontSize: 15},
});
