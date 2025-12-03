import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {MotiView} from 'moti';

export const Skeleton = ({width, height, borderRadius = 8, style}) => {
  return (
    <MotiView
      from={{opacity: 0.3}}
      animate={{opacity: 1}}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
      }}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E1E1E1',
        },
        style,
      ]}
    />
  );
};

export const SkeletonCard = () => (
  <View style={s.card}>
    <Skeleton width="60%" height={20} style={{marginBottom: 10}} />
    <Skeleton width="40%" height={32} />
  </View>
);

export const SkeletonMarketCard = () => (
  <View style={s.marketCard}>
    <Skeleton width="50%" height={24} style={{marginBottom: 15}} />
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <View>
        <Skeleton width={80} height={16} style={{marginBottom: 8}} />
        <Skeleton width={100} height={28} />
      </View>
      <View>
        <Skeleton width={80} height={16} style={{marginBottom: 8}} />
        <Skeleton width={100} height={28} />
      </View>
    </View>
  </View>
);

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    margin: 8,
  },
  marketCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    margin: 15,
  },
});
