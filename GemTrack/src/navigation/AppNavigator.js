import React, {useContext} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthContext} from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import POSScreen from '../screens/POSScreen';
import InventoryScreen from '../screens/InventoryScreen';
import AddItemScreen from '../screens/AddItemScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {fontSize: 12, fontWeight: '600'},
    }}>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{tabBarLabel: 'Dashboard', tabBarIcon: () => <Text style={{fontSize: 24}}>📊</Text>}}
    />
    <Tab.Screen
      name="POS"
      component={POSScreen}
      options={{tabBarLabel: 'POS', tabBarIcon: () => <Text style={{fontSize: 24}}>🛒</Text>}}
    />
    <Tab.Screen
      name="Inventory"
      component={InventoryScreen}
      options={{tabBarLabel: 'Inventory', tabBarIcon: () => <Text style={{fontSize: 24}}>💎</Text>}}
    />
    <Tab.Screen
      name="Customers"
      component={CustomersScreen}
      options={{tabBarLabel: 'Customers', tabBarIcon: () => <Text style={{fontSize: 24}}>👥</Text>}}
    />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const {user, loading} = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{headerShown: false}} />
            <Stack.Screen name="AddItem" component={AddItemScreen} options={{title: 'Add New Item'}} />
            <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{title: 'Customer Details'}} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
