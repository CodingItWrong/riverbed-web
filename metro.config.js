// Learn more https://docs.expo.io/guides/customizing-metro
const {getDefaultConfig} = require('expo/metro-config');

const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;

console.log('FAKE_API', process.env.FAKE_API);

module.exports = {
  ...getDefaultConfig(__dirname),
  resolver: {
    sourceExts:
      process.env.FAKE_API === 'true'
        ? ['fake.js', ...defaultSourceExts]
        : defaultSourceExts,
  },
};
