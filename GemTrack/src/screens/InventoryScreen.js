import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl, Modal, StyleSheet} from 'react-native';
import {items} from '../services/api';
import {formatCurrency} from '../utils/helpers';
import {generateBarcodesPDF} from '../utils/barcodePDF';
import {showSuccess, showError, showInfo} from '../utils/toast';

export default function InventoryScreen({navigation}) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({category: '', purity: ''});

  const load = async () => {
    try {
      const res = await items.getAll(1, search, filters);
      setData(res.data.items);
    } catch (e) {}
  };

  useEffect(() => {load()}, [search, filters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Inventory</Text>
        <View style={s.btnRow}>
          <TouchableOpacity style={s.printBtn} activeOpacity={0.7} onPress={async () => {
            try {
              const res = await items.getUnprinted();
              if (res.data.length === 0) return showInfo('All barcodes are already printed');
              await generateBarcodesPDF(res.data);
              await items.markAsPrinted(res.data.map(i => i.id));
              showSuccess('Barcodes generated and marked as printed');
            } catch (e) {
              showError(e.message || 'Failed to generate barcodes');
            }
          }}>
            <Text style={s.printText}>Print</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.filterBtn} activeOpacity={0.7} onPress={() => setShowFilter(true)}>
            <Text style={s.btnText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.addBtn} activeOpacity={0.7} onPress={() => navigation.navigate('AddItem')}>
            <Text style={s.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TextInput
        style={s.search}
        placeholder="Search items..."
        placeholderTextColor="#71717A"
        value={search}
        onChangeText={setSearch}
      />
      
      <FlatList
        data={data}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{padding: 24, paddingTop: 16}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
        renderItem={({item}) => (
          <View style={s.card}>
            <View style={s.cardRow}>
              <View style={s.thumbnail}>
                <Text style={s.icon}>💎</Text>
              </View>
              <View style={s.content}>
                <View style={s.cardHeader}>
                  <Text style={s.name}>{item.name}</Text>
                  {item.isSold && (
                    <View style={s.soldBadge}>
                      <Text style={s.soldText}>SOLD</Text>
                    </View>
                  )}
                </View>
                <Text style={s.detail}>SKU: {item.sku}</Text>
                <Text style={s.detail}>{item.purity} • {item.category} • {item.netWeight}g</Text>
                <Text style={s.price}>{formatCurrency(item.price)}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>No items found</Text>
          </View>
        }
      />

      <Modal visible={showFilter} animationType="slide" transparent={true}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Filter Items</Text>
            <TextInput
              style={s.input}
              placeholder="Category"
              placeholderTextColor="#71717A"
              value={filters.category}
              onChangeText={v => setFilters({...filters, category: v})}
            />
            <TextInput
              style={s.input}
              placeholder="Purity"
              placeholderTextColor="#71717A"
              value={filters.purity}
              onChangeText={v => setFilters({...filters, purity: v})}
            />
            <TouchableOpacity style={s.applyBtn} activeOpacity={0.7} onPress={() => setShowFilter(false)}>
              <Text style={s.applyText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.clearBtn} activeOpacity={0.7} onPress={() => {setFilters({category: '', purity: ''}); setShowFilter(false);}}>
              <Text style={s.clearText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0A0A0B'},
  header: {backgroundColor: '#141416', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#27272A'},
  title: {fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 16},
  btnRow: {flexDirection: 'row', gap: 8},
  printBtn: {backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)'},
  printText: {color: '#D4AF37', fontSize: 14, fontWeight: '600'},
  filterBtn: {backgroundColor: '#1C1C1F', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#27272A'},
  btnText: {color: '#FFFFFF', fontSize: 14, fontWeight: '600'},
  addBtn: {backgroundColor: '#D4AF37', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12},
  addText: {color: '#0A0A0B', fontSize: 14, fontWeight: '700'},
  search: {margin: 24, marginTop: 24, backgroundColor: '#141416', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, fontSize: 16, borderWidth: 1, borderColor: '#27272A', color: '#FFFFFF'},
  card: {backgroundColor: '#141416', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#27272A'},
  cardRow: {flexDirection: 'row'},
  thumbnail: {width: 64, height: 64, backgroundColor: '#1C1C1F', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#27272A'},
  icon: {fontSize: 32},
  content: {flex: 1},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8},
  name: {color: '#FFFFFF', fontSize: 18, fontWeight: '700', flex: 1},
  soldBadge: {backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)'},
  soldText: {color: '#EF4444', fontSize: 10, fontWeight: '700'},
  detail: {color: '#71717A', fontSize: 13, marginBottom: 4},
  price: {color: '#D4AF37', fontSize: 20, fontWeight: '700', marginTop: 8},
  empty: {alignItems: 'center', justifyContent: 'center', paddingVertical: 80},
  emptyText: {color: '#71717A', fontSize: 15},
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end'},
  modal: {backgroundColor: '#141416', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderTopWidth: 1, borderTopColor: '#27272A'},
  modalTitle: {color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 24, textAlign: 'center'},
  input: {backgroundColor: '#1C1C1F', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, color: '#FFFFFF', fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#27272A'},
  applyBtn: {backgroundColor: '#D4AF37', paddingVertical: 16, borderRadius: 12, marginBottom: 12},
  applyText: {color: '#0A0A0B', textAlign: 'center', fontSize: 16, fontWeight: '700'},
  clearBtn: {paddingVertical: 16},
  clearText: {color: '#A1A1AA', textAlign: 'center', fontSize: 16, fontWeight: '600'},
});


