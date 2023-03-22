console.log('USING FAKE HTTP CLIENT');

export default function fakeHttpClient({token} = {}) {
  return new FakeHttpClient();
}

class FakeHttpClient {
  async get(path) {
    switch (path) {
      default:
        throw new Error(`GET request not faked: ${path}`);
    }
  }

  async post(path, body, {headers} = {}) {
    switch (path) {
      default:
        throw new Error(`POST request not faked: ${path}`);
    }
  }

  async patch(path, body, {headers} = {}) {
    switch (path) {
      default:
        throw new Error(`PATCH request not faked: ${path}`);
    }
  }

  async delete(path, body, {headers} = {}) {
    switch (path) {
      default:
        throw new Error(`DELETE request not faked: ${path}`);
    }
  }
}
