import appBaseUrl from '../baseUrl';

export default function httpClient({token} = {}) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return new HttpClient({baseUrl: appBaseUrl, headers});
}

class HttpClient {
  constructor({baseUrl, headers}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async get(url) {
    const response = await fetch(this.#fullUrl(url), {
      method: 'GET',
      headers: this.headers,
    });
    const data = await response.json();
    return {data};
  }

  async post(url, body, {headers} = {}) {
    const response = await fetch(this.#fullUrl(url), {
      method: 'POST',
      headers: {...this.headers, ...headers},
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return {data};
  }

  async patch(url, body, {headers} = {}) {
    const response = await fetch(this.#fullUrl(url), {
      method: 'PATCH',
      headers: {...this.headers, ...headers},
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return {data};
  }

  async delete(url, body, {headers} = {}) {
    const response = await fetch(this.#fullUrl(url), {
      method: 'DELETE',
      headers: {...this.headers, ...headers},
      body: JSON.stringify(body),
    });
    try {
      const data = await response.json();
      return {data};
    } catch {
      return {data: null};
    }
  }

  #fullUrl(url) {
    return `${this.baseUrl}/${url}`;
  }
}
