// faked so we don't have to sign in
const fakeNativeStorage = {
  setStringAsync(key, value) {},

  async getStringAsync(key) {
    switch (key) {
      case 'RIVERBED_ACCESS_TOKEN':
        return 'fake_access_token';
      default:
        const message = `Storage key not faked: ${key}`;
        console.error(message);
        throw new Error(message);
    }
  },

  deleteStringAsync(key) {},
};

export default fakeNativeStorage;
