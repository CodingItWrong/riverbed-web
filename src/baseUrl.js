function getBaseUrl() {
  if (window.Cypress) {
    return 'http://cypressapi';
  }

  if (__DEV__) {
    return 'http://localhost:3000';
  } else {
    return 'https://eb.api.riverbed.app';
  }
}

const baseUrl = getBaseUrl();

export default baseUrl;
