import appBaseUrl from '../baseUrl';

export default function httpClient({token} = {}) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return new HttpClient({baseUrl: appBaseUrl, headers});
}

class ResponseError extends Error {
  constructor(response) {
    super('An error was returned from the server');
    this.response = response;
  }
}

class HttpClient {
  constructor({baseUrl, headers}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async get(url) {
    const response = await fetch(this._fullUrl(url), {
      method: 'GET',
      headers: this.headers,
    });
    const data = await response.json();
    return {data};
  }

  async post(url, body, {headers} = {}) {
    const response = await fetch(this._fullUrl(url), {
      method: 'POST',
      headers: {...this.headers, ...headers},
      body: JSON.stringify(body),
    });
    return this._processResponse(response);
  }

  async patch(url, body, {headers} = {}) {
    const response = await fetch(this._fullUrl(url), {
      method: 'PATCH',
      headers: {...this.headers, ...headers},
      body: JSON.stringify(body),
    });
    return this._processResponse(response);
  }

  async delete(url, body, {headers} = {}) {
    const response = await fetch(this._fullUrl(url), {
      method: 'DELETE',
      headers: {...this.headers, ...headers},
      body: JSON.stringify(body),
    });
    try {
      // have to await so the try/catch catches a rejection
      const data = await this._processResponse(response);
      return data;
    } catch {
      return {data: null};
    }
  }

  _fullUrl(url) {
    if (url.match(/^https?:\/\//)) {
      return url;
    }

    return `${this.baseUrl}/${url}`;
  }

  async _processResponse(response) {
    if (response.status >= 400) {
      const responseText = await response.text();
      console.error(response, responseText);
      throw new ResponseError(response);
    } else {
      const data = await response.json();
      return {data};
    }
  }
}
