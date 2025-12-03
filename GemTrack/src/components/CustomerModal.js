import React, {useState, useEffect} from 'react';
import {View, Modal, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import {customers} from '../services/api';

export default function CustomerModal({visible, onClose, onSelect}) {
  const [search, setSearch] = useState('');
  const [list, setList] = useState([]);
  const [mode, setMode] = useState('search');
  const [form, setForm] = useState({name: '', phone: '', email: ''});

  useEffect(() => {
    if (visible && mode === 'search') loadCustomers();
  }, [visible, search, mode]);

  const loadCustomers = async () => {
    try {
      const {data} = await customers.getAll(1, search);
      setList(data.customers);
    } catch (e) {}
  };

  const handleAdd = async () => {
    try {
      const {data} = await customers.create(form);
      onSelect(data);
      resetAndClose();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to add customer');
    }
  };

  const resetAndClose = () => {
    setMode('search');
    setForm({name: '', phone: '', email: ''});
    setSearch('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.modal}>
          <Text style={s.title}>{mode === 'search' ? 'Select Customer' : 'Add New Customer'}</Text>
          
          {mode === 'search' ? (
            <>
              <TextInput
                style={s.input}
                placeholder="Search by name or phone..."
                value={search}
                onChangeText={setSearch}
                autoFocus={true}
              />
              <FlatList
                data={list}
                keyExtractor={i => i.id.toString()}
                style={{maxHeight: 300}}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={s.item}
                    onPress={() => {
                      onSelect(item);
                      resetAndClose();
                    }}>
                    <Text style={s.name}>{item.name}</Text>
                    <Text style={s.phone}>{item.phone || 'No phone'}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={s.empty}>No customers found</Text>}
              />
              <TouchableOpacity style={s.btn} onPress={() => setMode('add')}>
                <Text style={s.btnText}>+ Quick Add New Customer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={s.input}
                placeholder="Name *"
                value={form.name}
                onChangeText={v => setForm({...form, name: v})}
                autoFocus={true}
              />
              <TextInput
                style={s.input}
                placeholder="Phone"
                value={form.phone}
                onChangeText={v => setForm({...form, phone: v})}
                keyboardType="phone-pad"
              />
              <TextInput
                style={s.input}
                placeholder="Email"
                value={form.email}
                onChangeText={v => setForm({...form, email: v})}
                keyboardType="email-address"
              />
              <TouchableOpacity style={s.btn} onPress={handleAdd}>
                <Text style={s.btnText}>Add Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.backBtn} onPress={() => setMode('search')}>
                <Text style={s.backText}>← Back to Search</Text>
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity style={s.close} onPress={resetAndClose}>
            <Text style={s.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  modal: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center'},
  input: {backgroundColor: '#F2F2F7', padding: 15, borderRadius: 10, marginBottom: 12, fontSize: 16},
  item: {padding: 15, borderBottomWidth: 1, borderColor: '#E5E5EA'},
  name: {fontSize: 17, fontWeight: '600', marginBottom: 3},
  phone: {fontSize: 14, color: '#8E8E93'},
  empty: {textAlign: 'center', padding: 30, color: '#8E8E93'},
  btn: {backgroundColor: '#007AFF', padding: 16, borderRadius: 10, marginTop: 10},
  btnText: {color: '#fff', textAlign: 'center', fontSize: 17, fontWeight: '600'},
  backBtn: {padding: 12, marginTop: 10},
  backText: {color: '#007AFF', textAlign: 'center', fontSize: 16},
  close: {padding: 12, marginTop: 5},
  closeText: {color: '#FF3B30', textAlign: 'center', fontSize: 16, fontWeight: '500'},
});
