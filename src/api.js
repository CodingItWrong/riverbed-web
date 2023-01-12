import {Platform} from 'react-native';
import baseUrl from './baseUrl';

function fullUrl(path) {
  return `${baseUrl}${path}`;
}

const api = {
  async get(path) {
    const response = await fetch(fullUrl(path));
    return response.json();
  },
  async patch(path, body) {
    const response = await fetch(fullUrl(path), {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/vnd.api+json'},
    });
    return response.json();
  },
};

export default api;
