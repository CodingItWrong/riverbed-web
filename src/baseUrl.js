import {isDevice} from 'expo-device';
import {Platform} from 'react-native';

// used by iOS physical dev device
// ifconfig | grep "inet "
const LOCAL_IP = '192.168.1.136';

function getBaseUrl() {
  if (window.Cypress) {
    return 'http://cypressapi';
  }

  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    } else if (Platform.OS === 'ios' && isDevice) {
      return `http://${LOCAL_IP}:3000`;
    } else {
      return 'http://localhost:3000';
    }
  } else {
    return 'https://api.riverbed.app';
  }
}

const baseUrl = getBaseUrl();

export default baseUrl;
