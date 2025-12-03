import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as Haptics from 'expo-haptics';
import {items, sales} from '../services/api';
import CustomerModal from '../components/CustomerModal';
import {generateInvoice} from '../utils/invoiceGenerator';
import {formatCurrency} from '../utils/helpers';
import {showSuccess, showError, showInfo} from '../utils/toast';

const PURITY_OPTIONS = ['22K', '18K', '14K', '24K', '916', '750'];
const CATEGORY_OPTIONS = ['Ring', 'Necklace', 'Chain', 'Bracelet', 'Earrings', 'Bangle', 'Pendant', 'Anklet', 'Mangalsutra'];

export default function POSScreen() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showPurityPicker, setShowPurityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [goldRate, setGoldRate] = useState(0);
  const [manualSku, setManualSku] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const addItemBySku = async (sku) => {
    try {
      const res = await items.getBySku(sku);
      const item = res.data;
      const {market} = require('../services/api');
      const rateRes = await market.getRates();
      const rate = rateRes.data.gold22K || 0;
      console.log('Fetched gold rate:', rate);
      setGoldRate(rate);
      
      const itemRate = item.rate || rate;
      const netWeight = parseFloat(item.netWeight) || 0;
      const calculatedPrice = netWeight * itemRate;
      
      console.log('Item rate:', itemRate, 'Net weight:', netWeight, 'Calculated price:', calculatedPrice);
      
      setEditingItem({
        ...item, 
        rate: itemRate,
        soldPrice: calculatedPrice || item.price
      });
      setShowEditItem(true);
      if (!customer) setShowCustomerModal(true);
    } catch (e) {
      console.error('Error fetching item:', e);
      showError('Item not found with this SKU');
    }
  };

  const confirmAddItem = () => {
    setCart([...cart, editingItem]);
    setShowEditItem(false);
    setEditingItem(null);
  };

  const handleScan = async ({data}) => {
    if (scanned) return;
    setScanned(true);
    setShowCamera(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addItemBySku(data);
    setTimeout(() => setScanned(false), 2000);
  };

  const handleManualAdd = async () => {
    if (!manualSku.trim()) return;
    await addItemBySku(manualSku.trim());
    setManualSku('');
    setShowManualInput(false);
  };

  const removeItem = idx => setCart(cart.filter((_, i) => i !== idx));
  const total = cart.reduce((sum, i) => sum + (i.soldPrice || 0), 0);

  const handleCheckout = async () => {
    if (!cart.length) return showError('Add items to proceed');
    if (!customer) return showError('Select a customer first');
    
    try {
      const payload = {
        customerId: customer.id,
        paymentMethod,
        items: cart.map(i => ({itemId: i.id, soldPrice: i.soldPrice})),
        amountPaid: parseFloat(amountPaid) || total,
      };
      const {data} = await sales.checkout(payload);
      
      await generateInvoice(
        customer,
        data,
        cart,
        paymentMethod,
        parseFloat(amountPaid) || total,
        Math.max(0, total - (parseFloat(amountPaid) || total))
      );
      
      showSuccess('Sale completed successfully!');
      setCart([]);
      setCustomer(null);
      setShowPayment(false);
      setAmountPaid('');
    } catch (e) {
      showError(e.response?.data?.message || 'Checkout failed');
    }
  };

  if (showCamera) {
    if (!permission?.granted) {
      return (
        <View style={s.container}>
          <Text style={s.permText}>Camera permission required for scanning</Text>
          <TouchableOpacity style={s.btn} onPress={requestPermission}>
            <Text style={s.btnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <CameraView
          style={{flex: 1}}
          onBarcodeScanned={handleScan}
          barcodeScannerSettings={{barcodeTypes: ['qr', 'ean13', 'code128', 'code39']}}
        />
        <TouchableOpacity style={s.closeCamera} onPress={() => setShowCamera(false)}>
          <Text style={s.btnText}>✕ Close Scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.customerBar}>
        <View>
          <Text style={s.customerLabel}>Customer</Text>
          <Text style={s.customerName}>{customer ? customer.name : 'Not Selected'}</Text>
        </View>
        <TouchableOpacity style={s.changeBtn} onPress={() => setShowCustomerModal(true)}>
          <Text style={s.changeBtnText}>{customer ? 'Change' : 'Select'}</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={cart}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{padding: 15}}
        renderItem={({item, index}) => (
          <View style={s.cartItem}>
            <View style={{flex: 1}}>
              <Text style={s.itemName}>{item.name}</Text>
              <Text style={s.itemSku}>SKU: {item.sku} | {item.purity}</Text>
              <Text style={s.itemWeight}>Net Wt: {item.netWeight}g</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={s.itemPrice}>{formatCurrency(item.soldPrice)}</Text>
              <TouchableOpacity onPress={() => removeItem(index)} style={s.removeBtn}>
                <Text style={s.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>Cart is empty</Text>
            <Text style={s.emptySubtext}>Scan items to add them</Text>
          </View>
        }
      />

      <View style={s.footer}>
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total Amount</Text>
          <Text style={s.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <TouchableOpacity style={[s.scanBtn, {flex: 1, marginRight: 5}]} onPress={() => setShowCamera(true)}>
            <Text style={s.scanBtnText}>📷 Scan Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.scanBtn, {flex: 1, marginLeft: 5, backgroundColor: '#FF9500'}]} onPress={() => setShowManualInput(true)}>
            <Text style={s.scanBtnText}>⌨️ Type Code</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[s.checkoutBtn, (!cart.length || !customer) && s.btnDisabled]}
          onPress={() => setShowPayment(true)}
          disabled={!cart.length || !customer}>
          <Text style={s.btnText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>

      <CustomerModal
        visible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelect={c => {
          setCustomer(c);
          setShowCustomerModal(false);
        }}
      />

      <Modal visible={showManualInput} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.paymentModal}>
            <Text style={s.modalTitle}>Enter SKU</Text>
            <TextInput
              style={s.input}
              placeholder="Enter item SKU"
              value={manualSku}
              onChangeText={setManualSku}
              autoFocus={true}
            />
            <TouchableOpacity style={s.completeBtn} onPress={handleManualAdd}>
              <Text style={s.btnText}>Find Item</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setShowManualInput(false); setManualSku('');}}>
              <Text style={s.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showEditItem} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{justifyContent: 'flex-end', flexGrow: 1}}>
            <View style={s.paymentModal}>
              <Text style={s.modalTitle}>Edit Item Details</Text>
              {editingItem && (
                <>
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>{editingItem.name}</Text>
                    <Text style={s.summaryValue}>SKU: {editingItem.sku}</Text>
                  </View>
                  
                  <Text style={s.fieldLabel}>Purity</Text>
                  <TouchableOpacity style={s.input} onPress={() => setShowPurityPicker(true)}>
                    <Text style={editingItem.purity ? s.inputText : s.placeholder}>{editingItem.purity || 'Select Purity'}</Text>
                  </TouchableOpacity>
                  
                  <Text style={s.fieldLabel}>Category</Text>
                  <TouchableOpacity style={s.input} onPress={() => setShowCategoryPicker(true)}>
                    <Text style={editingItem.category ? s.inputText : s.placeholder}>{editingItem.category || 'Select Category'}</Text>
                  </TouchableOpacity>
                  
                  <Text style={s.fieldLabel}>Gross Weight (grams)</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0.00"
                    value={String(editingItem.grossWeight || '')}
                    onChangeText={v => setEditingItem({...editingItem, grossWeight: parseFloat(v) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Net Weight (grams)</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0.00"
                    value={String(editingItem.netWeight || '')}
                    onChangeText={v => {
                      const weight = parseFloat(v) || 0;
                      const price = weight * (editingItem.rate || 0);
                      setEditingItem({...editingItem, netWeight: weight, soldPrice: price});
                    }}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Gold Rate per gram (Current: ₹{goldRate})</Text>
                  <TextInput
                    style={s.input}
                    placeholder={String(goldRate)}
                    value={editingItem.rate ? String(editingItem.rate) : ''}
                    onChangeText={v => {
                      const rate = parseFloat(v) || 0;
                      const price = (editingItem.netWeight || 0) * rate;
                      setEditingItem({...editingItem, rate, soldPrice: price});
                    }}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Making Per Gram</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0.00"
                    value={String(editingItem.makingPerGm || '')}
                    onChangeText={v => setEditingItem({...editingItem, makingPerGm: parseFloat(v) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Wastage %</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0.00"
                    value={String(editingItem.wastagePct || '')}
                    onChangeText={v => setEditingItem({...editingItem, wastagePct: parseFloat(v) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Hallmarking Charges</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0"
                    value={String(editingItem.hallmarkingCharges || '')}
                    onChangeText={v => setEditingItem({...editingItem, hallmarkingCharges: parseInt(v) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Stone Charges</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0"
                    value={String(editingItem.stoneCharges || '')}
                    onChangeText={v => setEditingItem({...editingItem, stoneCharges: parseInt(v) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Other Charges</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0"
                    value={String(editingItem.otherCharges || '')}
                    onChangeText={v => setEditingItem({...editingItem, otherCharges: parseInt(v) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text style={s.fieldLabel}>Sold Price</Text>
                  <TextInput
                    style={s.input}
                    placeholder="0.00"
                    value={String(editingItem.soldPrice || '')}
                    onChangeText={v => setEditingItem({...editingItem, soldPrice: parseFloat(v) || 0})}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={s.completeBtn} onPress={confirmAddItem}>
                    <Text style={s.btnText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {setShowEditItem(false); setEditingItem(null);}}>
                    <Text style={s.cancel}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showPayment} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.paymentModal}>
            <Text style={s.modalTitle}>Payment Details</Text>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total Amount:</Text>
              <Text style={s.summaryValue}>{formatCurrency(total)}</Text>
            </View>
            <TextInput
              style={s.input}
              placeholder={`Amount Paid (default: ${formatCurrency(total)})`}
              value={amountPaid}
              onChangeText={setAmountPaid}
              keyboardType="numeric"
            />
            <Text style={s.methodLabel}>Payment Method</Text>
            <View style={s.methodRow}>
              {['Cash', 'Card', 'UPI'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[s.methodBtn, paymentMethod === m && s.methodActive]}
                  onPress={() => setPaymentMethod(m)}>
                  <Text style={[s.methodText, paymentMethod === m && s.methodTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.completeBtn} onPress={handleCheckout}>
              <Text style={s.btnText}>Complete Sale</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPayment(false)}>
              <Text style={s.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showPurityPicker} transparent={true} animationType="slide">
        <View style={s.overlay}>
          <View style={s.pickerModal}>
            <Text style={s.modalTitle}>Select Purity</Text>
            <ScrollView>
              {PURITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={s.pickerOption}
                  onPress={() => {
                    setEditingItem({...editingItem, purity: option});
                    setShowPurityPicker(false);
                  }}>
                  <Text style={s.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.pickerCancel} onPress={() => setShowPurityPicker(false)}>
              <Text style={s.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCategoryPicker} transparent={true} animationType="slide">
        <View style={s.overlay}>
          <View style={s.pickerModal}>
            <Text style={s.modalTitle}>Select Category</Text>
            <ScrollView>
              {CATEGORY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={s.pickerOption}
                  onPress={() => {
                    setEditingItem({...editingItem, category: option});
                    setShowCategoryPicker(false);
                  }}>
                  <Text style={s.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.pickerCancel} onPress={() => setShowCategoryPicker(false)}>
              <Text style={s.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F2F2F7'},
  customerBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E5EA'},
  customerLabel: {fontSize: 12, color: '#8E8E93', marginBottom: 2},
  customerName: {fontSize: 18, fontWeight: '600'},
  changeBtn: {backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8},
  changeBtnText: {color: '#fff', fontWeight: '600', fontSize: 15},
  cartItem: {flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2},
  itemName: {fontSize: 17, fontWeight: '600', marginBottom: 4},
  itemSku: {fontSize: 13, color: '#8E8E93', marginBottom: 2},
  itemWeight: {fontSize: 13, color: '#8E8E93'},
  itemPrice: {fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 8},
  removeBtn: {backgroundColor: '#FF3B30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6},
  removeText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  empty: {alignItems: 'center', justifyContent: 'center', paddingVertical: 60},
  emptyText: {fontSize: 20, fontWeight: '600', color: '#8E8E93', marginBottom: 5},
  emptySubtext: {fontSize: 15, color: '#C7C7CC'},
  footer: {padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E5EA'},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15},
  totalLabel: {fontSize: 18, fontWeight: '600'},
  totalValue: {fontSize: 28, fontWeight: 'bold', color: '#007AFF'},
  scanBtn: {backgroundColor: '#5856D6', padding: 16, borderRadius: 12, marginBottom: 10},
  scanBtnText: {color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '600'},
  checkoutBtn: {backgroundColor: '#34C759', padding: 16, borderRadius: 12},
  btnDisabled: {backgroundColor: '#C7C7CC'},
  btnText: {color: '#fff', textAlign: 'center', fontSize: 17, fontWeight: '600'},
  closeCamera: {position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12},
  permText: {fontSize: 16, textAlign: 'center', padding: 20, color: '#8E8E93'},
  btn: {backgroundColor: '#007AFF', padding: 16, borderRadius: 12, margin: 20},
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  paymentModal: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20},
  modalTitle: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, padding: 15, backgroundColor: '#F2F2F7', borderRadius: 10},
  summaryLabel: {fontSize: 16, fontWeight: '500'},
  summaryValue: {fontSize: 20, fontWeight: 'bold', color: '#007AFF'},
  input: {backgroundColor: '#F2F2F7', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16},
  methodLabel: {fontSize: 16, fontWeight: '600', marginBottom: 10},
  methodRow: {flexDirection: 'row', marginBottom: 20},
  methodBtn: {flex: 1, padding: 15, borderRadius: 10, borderWidth: 2, borderColor: '#E5E5EA', marginHorizontal: 5, alignItems: 'center'},
  methodActive: {backgroundColor: '#007AFF', borderColor: '#007AFF'},
  methodText: {fontSize: 16, fontWeight: '600', color: '#8E8E93'},
  methodTextActive: {color: '#fff'},
  completeBtn: {backgroundColor: '#34C759', padding: 16, borderRadius: 12, marginBottom: 10},
  cancel: {textAlign: 'center', color: '#FF3B30', padding: 15, fontSize: 16, fontWeight: '500'},
  fieldLabel: {fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 5, marginTop: 5},
  inputText: {fontSize: 16, color: '#000'},
  placeholder: {fontSize: 16, color: '#999'},
  pickerModal: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%'},
  pickerOption: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'},
  pickerOptionText: {fontSize: 17, color: '#000'},
  pickerCancel: {marginTop: 10, padding: 15},
});
