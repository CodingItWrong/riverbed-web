import {Platform} from 'react-native';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

function fullUrl(path) {
  return `${BASE_URL}${path}`;
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
