import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import PieChart from 'react-native-pie-chart';
import {dashboard} from '../services/api';
import {fetchGoldRates} from '../services/goldapi';
import {AuthContext} from '../context/AuthContext';

export default function DashboardScreen({navigation}) {
  const {logout} = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [goldRates, setGoldRates] = useState(null);
  const [salesStats, setSalesStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load data when screen opens
  const loadData = async () => {
    try {
      const statsData = await dashboard.getStats();
      const ratesData = await fetchGoldRates();
      const salesData = await dashboard.getTotalSalesStats();
      setStats(statsData.data);
      setGoldRates(ratesData);
      setSalesStats(salesData.data);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  // Load data on first render
  useEffect(() => {
    loadData();
  }, []);

  // Refresh when user pulls down
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Gold Rates Table */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Gold Rates</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, {flex: 2}]}>PURITY</Text>
            <Text style={styles.tableHeaderText}>RATE/GM</Text>
          </View>
          {goldRates && (
            <>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 2}]}>24 Karat Gold</Text>
                <Text style={styles.tableCell}>₹{goldRates.gold24k}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 2}]}>22 Karat Gold</Text>
                <Text style={styles.tableCell}>₹{goldRates.gold22k}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 2}]}>Silver</Text>
                <Text style={styles.tableCell}>₹{goldRates.silver}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, {backgroundColor: '#4CAF50'}]}>
          <Text style={styles.statNumber}>{stats?.totalSales || 0}</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#2196F3'}]}>
          <Text style={styles.statNumber}>₹{stats?.totalRevenue || 0}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, {backgroundColor: '#FF9800'}]}>
          <Text style={styles.statNumber}>{stats?.totalItems || 0}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#9C27B0'}]}>
          <Text style={styles.statNumber}>{stats?.totalCustomers || 0}</Text>
          <Text style={styles.statLabel}>Customers</Text>
        </View>
      </View>

      {/* Total Sales Graph */}
      {salesStats && salesStats.byCategory && salesStats.byCategory.length > 0 && (() => {
        const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#FF6B6B', '#4ECDC4'];
        const series = salesStats.byCategory.map((c, i) => ({
          value: c.amount,
          color: colors[i % colors.length]
        }));
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Sales by Category</Text>
            <View style={styles.chartContainer}>
              <PieChart
                widthAndHeight={200}
                series={series}
                doughnut
                coverRadius={0.6}
                coverFill={'#FFF'}
              />
              <View style={styles.legend}>
                {salesStats.byCategory.map((cat, idx) => (
                  <View key={idx} style={styles.legendItem}>
                    <View style={[styles.legendColor, {backgroundColor: colors[idx % colors.length]}]} />
                    <Text style={styles.legendText}>{cat.category}: ₹{cat.amount.toFixed(0)}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.totalSalesText}>Total: ₹{salesStats.totalAmount.toFixed(0)}</Text>
          </View>
        );
      })()}

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('POS')}>
          <Text style={styles.actionButtonText}>🛒 New Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.actionButtonText}>➕ Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.actionButtonText}>💎 View Inventory</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  header: {
    backgroundColor: '#141416',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  logoutBtn: {backgroundColor: '#1C1C1F', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#27272A'},
  logoutText: {color: '#A1A1AA', fontWeight: '600', fontSize: 14},
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerDate: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#141416',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  table: {
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1F',
    padding: 14,
  },
  tableHeaderText: {
    flex: 1,
    color: '#D4AF37',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    backgroundColor: '#141416',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#1C1C1F',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  legend: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
  totalSalesText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
    color: '#D4AF37',
  },
});
