import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MotiView} from 'moti';
import {LinearGradient} from 'expo-linear-gradient';
import {formatCurrency} from '../../utils/helpers';

export default function MarketRateCard({rates}) {
  if (!rates) return null;

  const RateItem = ({label, value, trend}) => (
    <MotiView
      from={{opacity: 0, translateY: 20}}
      animate={{opacity: 1, translateY: 0}}
      transition={{type: 'timing', duration: 600}}
      style={s.rateItem}>
      <Text style={s.rateLabel}>{label}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <MotiView
          from={{scale: 0.8}}
          animate={{scale: 1}}
          transition={{type: 'spring', delay: 300}}>
          <Text style={s.rateValue}>{formatCurrency(value)}/g</Text>
        </MotiView>
        {trend && (
          <Text style={[s.trend, trend > 0 ? s.trendUp : s.trendDown]}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
          </Text>
        )}
      </View>
    </MotiView>
  );

  return (
    <MotiView
      from={{opacity: 0, scale: 0.9}}
      animate={{opacity: 1, scale: 1}}
      transition={{type: 'spring', delay: 100}}
      style={s.container}>
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={s.gradient}>
        <View style={s.header}>
          <Text style={s.title}>📈 Live Market Rates</Text>
          <Text style={s.timestamp}>
            {new Date(rates.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={s.ratesRow}>
          <RateItem label="Gold 24K" value={rates.gold24k} trend={rates.gold24kTrend} />
          <RateItem label="Gold 22K" value={rates.gold22k} trend={rates.gold22kTrend} />
          <RateItem label="Silver" value={rates.silver} trend={rates.silverTrend} />
        </View>
      </LinearGradient>
    </MotiView>
  );
}

const s = StyleSheet.create({
  container: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  ratesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateItem: {
    flex: 1,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '600',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  trend: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  trendUp: {
    color: '#34C759',
  },
  trendDown: {
    color: '#FF3B30',
  },
});
