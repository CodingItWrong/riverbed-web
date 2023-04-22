module.exports = ({config}) => ({
  ...config,
  extra: {
    ...config.extra,
    googleMapsApiKeyWeb: process.env.RIVERBED_GOOGLE_MAPS_API_KEY_WEB,
  },
});
