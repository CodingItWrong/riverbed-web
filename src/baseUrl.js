function getBaseUrl() {
  if (window.Cypress) {
    return 'http://cypressapi';
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  } else {
    return 'https://api.riverbed.app';
  }
}

const baseUrl = getBaseUrl();

export default baseUrl;
