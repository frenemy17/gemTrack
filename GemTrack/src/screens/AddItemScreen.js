import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, Modal} from 'react-native';
import {items} from '../services/api';
import {generateSKU} from '../utils/helpers';
import {showSuccess, showError} from '../utils/toast';

const PURITY_OPTIONS = ['22K', '18K', '14K', '24K', '916', '750'];
const CATEGORY_OPTIONS = ['Ring', 'Necklace', 'Chain', 'Bracelet', 'Earrings', 'Bangle', 'Pendant', 'Anklet', 'Mangalsutra'];
const METAL_OPTIONS = ['Gold', 'Silver', 'Platinum'];

export default function AddItemScreen({navigation}) {
  const [form, setForm] = useState({
    name: '', sku: '', huid: '', purity: '', category: '', metal: '',
    grossWeight: '', netWeight: '', makingPerGm: '', wastagePct: '',
    hallmarkingCharges: '', stoneCharges: '', otherCharges: '',
    cgstPct: '', sgstPct: '', cost: '', price: ''
  });
  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [showPurityPicker, setShowPurityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showMetalPicker, setShowMetalPicker] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return showError('Name and Price are required');
    const payload = {...form, sku: form.sku || generateSKU()};
    try {
      await items.create(payload);
      showSuccess('Item added successfully');
      navigation.goBack();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to add item');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container}>
        <Text style={s.section}>Essentials</Text>
        <TextInput style={s.input} placeholder="Item Name *" value={form.name} onChangeText={v => setForm({...form, name: v})} />
        <View style={{flexDirection: 'row'}}>
          <TextInput 
            style={[s.input, {flex: 1}]} 
            placeholder="SKU (auto-gen)" 
            value={form.sku} 
            onChangeText={v => {
              setForm({...form, sku: v});
              if (v) setBarcodeUrl(`https://barcodeapi.org/api/auto/${encodeURIComponent(v)}`);
            }} 
          />
          <TouchableOpacity style={s.genBtn} onPress={() => {
            const sku = generateSKU();
            setForm({...form, sku});
            setBarcodeUrl(`https://barcodeapi.org/api/auto/${encodeURIComponent(sku)}`);
          }}>
            <Text style={s.genText}>Generate</Text>
          </TouchableOpacity>
        </View>
        {barcodeUrl && <Image source={{uri: barcodeUrl}} style={s.barcode} />}
        <TextInput style={s.input} placeholder="HUID" value={form.huid} onChangeText={v => setForm({...form, huid: v})} />
        
        <TouchableOpacity style={s.input} onPress={() => setShowMetalPicker(true)}>
          <Text style={form.metal ? s.inputText : s.placeholder}>{form.metal || 'Metal Type (Gold, Silver, etc.)'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={s.input} onPress={() => setShowPurityPicker(true)}>
          <Text style={form.purity ? s.inputText : s.placeholder}>{form.purity || 'Purity (22K, 18K, etc.)'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={s.input} onPress={() => setShowCategoryPicker(true)}>
          <Text style={form.category ? s.inputText : s.placeholder}>{form.category || 'Category (Ring, Necklace, etc.)'}</Text>
        </TouchableOpacity>

        <Text style={s.section}>Measurements</Text>
        <TextInput style={s.input} placeholder="Gross Weight (g)" value={form.grossWeight} onChangeText={v => setForm({...form, grossWeight: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Net Weight (g)" value={form.netWeight} onChangeText={v => setForm({...form, netWeight: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Making Per Gram" value={form.makingPerGm} onChangeText={v => setForm({...form, makingPerGm: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Wastage %" value={form.wastagePct} onChangeText={v => setForm({...form, wastagePct: v})} keyboardType="numeric" />

        <Text style={s.section}>Charges & Taxes</Text>
        <TextInput style={s.input} placeholder="Hallmarking Charges" value={form.hallmarkingCharges} onChangeText={v => setForm({...form, hallmarkingCharges: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Stone Charges" value={form.stoneCharges} onChangeText={v => setForm({...form, stoneCharges: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Other Charges" value={form.otherCharges} onChangeText={v => setForm({...form, otherCharges: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="CGST %" value={form.cgstPct} onChangeText={v => setForm({...form, cgstPct: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="SGST %" value={form.sgstPct} onChangeText={v => setForm({...form, sgstPct: v})} keyboardType="numeric" />

        <Text style={s.section}>Pricing</Text>
        <TextInput style={s.input} placeholder="Cost" value={form.cost} onChangeText={v => setForm({...form, cost: v})} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Selling Price *" value={form.price} onChangeText={v => setForm({...form, price: v})} keyboardType="numeric" />

        <TouchableOpacity style={s.btn} onPress={handleSubmit}>
          <Text style={s.btnText}>Add Item to Inventory</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showMetalPicker} transparent={true} animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.pickerModal}>
            <Text style={s.pickerTitle}>Select Metal Type</Text>
            <ScrollView>
              {METAL_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={s.pickerOption}
                  onPress={() => {
                    setForm({...form, metal: option});
                    setShowMetalPicker(false);
                  }}>
                  <Text style={s.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.pickerCancel} onPress={() => setShowMetalPicker(false)}>
              <Text style={s.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPurityPicker} transparent={true} animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.pickerModal}>
            <Text style={s.pickerTitle}>Select Purity</Text>
            <ScrollView>
              {PURITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={s.pickerOption}
                  onPress={() => {
                    setForm({...form, purity: option});
                    setShowPurityPicker(false);
                  }}>
                  <Text style={s.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.pickerCancel} onPress={() => setShowPurityPicker(false)}>
              <Text style={s.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCategoryPicker} transparent={true} animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.pickerModal}>
            <Text style={s.pickerTitle}>Select Category</Text>
            <ScrollView>
              {CATEGORY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={s.pickerOption}
                  onPress={() => {
                    setForm({...form, category: option});
                    setShowCategoryPicker(false);
                  }}>
                  <Text style={s.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.pickerCancel} onPress={() => setShowCategoryPicker(false)}>
              <Text style={s.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F2F2F7'},
  section: {fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10},
  input: {backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, fontSize: 16},
  genBtn: {backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginLeft: 10, marginBottom: 12},
  genText: {color: '#fff', fontWeight: '600'},
  barcode: {width: '100%', height: 80, resizeMode: 'contain', backgroundColor: '#fff', marginBottom: 12, borderRadius: 10},
  btn: {backgroundColor: '#34C759', padding: 16, borderRadius: 12, marginTop: 10, marginBottom: 30},
  btnText: {color: '#fff', textAlign: 'center', fontSize: 17, fontWeight: '600'},
  inputText: {fontSize: 16, color: '#000'},
  placeholder: {fontSize: 16, color: '#999'},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'},
  pickerModal: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%'},
  pickerTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center'},
  pickerOption: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'},
  pickerOptionText: {fontSize: 17, color: '#000'},
  pickerCancel: {marginTop: 10, padding: 15, backgroundColor: '#FF3B30', borderRadius: 10},
  pickerCancelText: {color: '#fff', textAlign: 'center', fontSize: 17, fontWeight: '600'},
});
