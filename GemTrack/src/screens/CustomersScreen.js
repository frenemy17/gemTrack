import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, RefreshControl} from 'react-native';
import {customers, sales} from '../services/api';
import {formatCurrency} from '../utils/helpers';

export default function CustomersScreen({navigation}) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await customers.getAll(1, search);
      setData(res.data.customers);
    } catch (e) {}
  };

  useEffect(() => {load()}, [search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Customers</Text>
      </View>
      
      <TextInput
        style={s.search}
        placeholder="Search by name or phone..."
        value={search}
        onChangeText={setSearch}
      />
      
      <FlatList
        data={data}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{padding: 15}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({item}) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate('CustomerDetail', {customer: item})}>
            <View style={{flex: 1}}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.detail}>Phone: {item.phone || 'N/A'}</Text>
              <Text style={s.detail}>Email: {item.email || 'N/A'}</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={s.empty}>No customers found</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F2F2F7'},
  header: {padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E5EA'},
  title: {fontSize: 28, fontWeight: 'bold'},
  search: {margin: 15, padding: 15, backgroundColor: '#fff', borderRadius: 12, fontSize: 16},
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2},
  name: {fontSize: 18, fontWeight: '600', marginBottom: 5},
  detail: {fontSize: 14, color: '#8E8E93', marginBottom: 2},
  arrow: {fontSize: 30, color: '#C7C7CC', marginLeft: 10},
  empty: {textAlign: 'center', padding: 40, color: '#8E8E93', fontSize: 16},
});
