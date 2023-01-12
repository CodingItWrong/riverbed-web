import baseUrl from './baseUrl';

const JSON_API_CONTENT_TYPE = {'Content-Type': 'application/vnd.api+json'};

function fullUrl(path) {
  return `${baseUrl}${path}`;
}

const api = {
  async get(path) {
    const response = await fetch(fullUrl(path));
    return response.json();
  },
  async post(path, body) {
    const response = await fetch(fullUrl(path), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: JSON_API_CONTENT_TYPE,
    });
    return response.json();
  },
  async patch(path, body) {
    const response = await fetch(fullUrl(path), {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: JSON_API_CONTENT_TYPE,
    });
    return response.json();
  },
  async delete(path) {
    return fetch(fullUrl(path), {method: 'DELETE'});
  },
};

export default api;
