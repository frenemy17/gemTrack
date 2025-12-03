import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {sales} from '../services/api';
import {formatCurrency, formatDate} from '../utils/helpers';

export default function CustomerDetailScreen({route}) {
  const {customer} = route.params;
  const [purchases, setPurchases] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const {data} = await sales.getAll(1);
      const filtered = data.sales.filter(s => s.customerId === customer.id);
      setPurchases(filtered);
    } catch (e) {}
  };

  useEffect(() => {load()}, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const totalDue = purchases.reduce((sum, s) => sum + (s.amountDue || 0), 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.name}>{customer.name}</Text>
        <Text style={s.phone}>{customer.phone || 'No phone'}</Text>
        {customer.email && <Text style={s.email}>{customer.email}</Text>}
        
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Total Purchases</Text>
            <Text style={s.statValue}>{purchases.length}</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statLabel}>Total Spent</Text>
            <Text style={s.statValue}>{formatCurrency(purchases.reduce((sum, s) => sum + (s.totalSaleAmount || 0), 0))}</Text>
          </View>
        </View>
        
        {totalDue > 0 && (
          <View style={s.dueBadge}>
            <Text style={s.dueText}>Amount Pending: {formatCurrency(totalDue)}</Text>
          </View>
        )}
      </View>
      
      <Text style={s.sectionTitle}>Purchase History</Text>
      
      <FlatList
        data={purchases}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{padding: 15}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({item}) => (
          <View style={s.card}>
            <View style={{flex: 1}}>
              <Text style={s.saleId}>Sale #{item.id}</Text>
              <Text style={s.detail}>Date: {formatDate(item.createdAt)}</Text>
              <Text style={s.detail}>Items: {item.saleItems?.length || 0}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={s.amount}>{formatCurrency(item.totalSaleAmount)}</Text>
              {item.amountDue > 0 ? (
                <View>
                  <Text style={[s.status, s.pending]}>Pending: {formatCurrency(item.amountDue)}</Text>
                  <Text style={s.paidAmount}>Paid: {formatCurrency(item.amountPaid || 0)}</Text>
                </View>
              ) : (
                <Text style={[s.status, s.paid]}>PAID</Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No purchase history</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F2F2F7'},
  header: {backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderColor: '#E5E5EA'},
  name: {fontSize: 28, fontWeight: 'bold', marginBottom: 5},
  phone: {fontSize: 16, color: '#8E8E93', marginBottom: 3},
  email: {fontSize: 14, color: '#8E8E93'},
  statsRow: {flexDirection: 'row', marginTop: 15, gap: 10},
  statBox: {flex: 1, backgroundColor: '#F2F2F7', padding: 12, borderRadius: 10, alignItems: 'center'},
  statLabel: {fontSize: 12, color: '#8E8E93', marginBottom: 4},
  statValue: {fontSize: 16, fontWeight: 'bold', color: '#007AFF'},
  dueBadge: {backgroundColor: '#FF3B30', padding: 12, borderRadius: 10, marginTop: 15},
  dueText: {color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
  paidAmount: {fontSize: 11, color: '#34C759', marginTop: 2, fontWeight: '600'},
  sectionTitle: {fontSize: 20, fontWeight: 'bold', padding: 15},
  card: {flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2},
  saleId: {fontSize: 17, fontWeight: '600', marginBottom: 5},
  detail: {fontSize: 14, color: '#8E8E93', marginBottom: 2},
  amount: {fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 5},
  status: {fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 2},
  paid: {backgroundColor: '#34C759', color: '#fff'},
  pending: {backgroundColor: '#FF9500', color: '#fff'},
  empty: {textAlign: 'center', padding: 40, color: '#8E8E93', fontSize: 16},
});
