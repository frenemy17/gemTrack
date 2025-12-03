import {Alert} from 'react-native';

export const showSuccess = (message) => {
  if (typeof window !== 'undefined' && window.alert) {
    alert(message);
  } else {
    Alert.alert('Success', message);
  }
};

export const showError = (message) => {
  if (typeof window !== 'undefined' && window.alert) {
    alert(message);
  } else {
    Alert.alert('Error', message);
  }
};

export const showInfo = (message) => {
  if (typeof window !== 'undefined' && window.alert) {
    alert(message);
  } else {
    Alert.alert('Info', message);
  }
};

export const showWarning = (message) => {
  if (typeof window !== 'undefined' && window.alert) {
    alert(message);
  } else {
    Alert.alert('Warning', message);
  }
};
