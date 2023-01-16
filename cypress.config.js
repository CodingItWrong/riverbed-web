const {defineConfig} = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:19006',
    experimentalRunAllSpecs: true,
  },
  chromeWebSecurity: false,
});
