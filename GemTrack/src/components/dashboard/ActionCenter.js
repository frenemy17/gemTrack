import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {MotiView} from 'moti';

export default function ActionCenter({onAction}) {
  const actions = [
    {id: 'addItem', label: 'Add Item', icon: '➕', color: '#007AFF'},
    {id: 'newSale', label: 'New Sale', icon: '🛒', color: '#34C759'},
    {id: 'addCustomer', label: 'Add Customer', icon: '👤', color: '#5856D6'},
  ];

  return (
    <View style={s.container}>
      <Text style={s.title}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {actions.map((action, index) => (
          <MotiView
            key={action.id}
            from={{opacity: 0, translateX: -20}}
            animate={{opacity: 1, translateX: 0}}
            transition={{type: 'spring', delay: 600 + index * 100}}>
            <TouchableOpacity
              style={[s.actionBtn, {backgroundColor: action.color}]}
              onPress={() => onAction(action.id)}
              activeOpacity={0.8}>
              <Text style={s.icon}>{action.icon}</Text>
              <Text style={s.label}>{action.label}</Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  scroll: {
    paddingHorizontal: 15,
  },
  actionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
