import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {MotiView} from 'moti';
import {formatCurrency} from '../../utils/helpers';

export default function StatGrid({stats, onStatTap}) {
  if (!stats) return null;

  const StatCard = ({title, value, color, icon, delay, type}) => (
    <MotiView
      from={{opacity: 0, translateY: 30}}
      animate={{opacity: 1, translateY: 0}}
      transition={{type: 'spring', delay}}
      style={{width: '48%', margin: '1%'}}>
      <TouchableOpacity
        style={[s.card, {borderLeftWidth: 4, borderLeftColor: color}]}
        onPress={() => onStatTap(type)}
        activeOpacity={0.7}>
        <Text style={s.icon}>{icon}</Text>
        <Text style={s.title}>{title}</Text>
        <MotiView
          from={{scale: 0.8}}
          animate={{scale: 1}}
          transition={{type: 'spring', delay: delay + 200}}>
          <Text style={[s.value, {color}]}>{value}</Text>
        </MotiView>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={s.container}>
      <StatCard
        title="Revenue"
        value={formatCurrency(stats.totalRevenue || 0)}
        color="#34C759"
        icon="💰"
        delay={200}
        type="revenue"
      />
      <StatCard
        title="Pending Dues"
        value={formatCurrency(stats.pendingDues || 0)}
        color="#FF9500"
        icon="⏳"
        delay={300}
        type="dues"
      />
      <StatCard
        title="Stock Count"
        value={stats.totalItems || 0}
        color="#007AFF"
        icon="💎"
        delay={400}
        type="stock"
      />
      <StatCard
        title="Customers"
        value={stats.totalCustomers || 0}
        color="#5856D6"
        icon="👥"
        delay={500}
        type="customers"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
