import {Platform} from 'react-native';
import nativeStorage from './native';
import webStorage from './web';

const platformStorage = () =>
  Platform.select({
    web: webStorage,
    default: nativeStorage,
  });

export function setStringAsync(key, value) {
  return platformStorage().setStringAsync(key, value);
}

export function getStringAsync(key) {
  return platformStorage().getStringAsync(key);
}

export function deleteStringAsync(key) {
  return platformStorage().deleteStringAsync(key);
}
