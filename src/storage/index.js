import webStorage from './web';

const platformStorage = () => webStorage;

export function setStringAsync(key, value) {
  return platformStorage().setStringAsync(key, value);
}

export function getStringAsync(key) {
  return platformStorage().getStringAsync(key);
}

export function deleteStringAsync(key) {
  return platformStorage().deleteStringAsync(key);
}
