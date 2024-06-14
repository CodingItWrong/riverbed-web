const dotenvResult = require('dotenv').config({path: './.env.production'});

if (dotenvResult.error) {
  throw dotenvResult.error;
} else if (!dotenvResult.parsed.RIVERBED_GOOGLE_MAPS_API_KEY) {
  throw new Error('Missing required envvar: RIVERBED_GOOGLE_MAPS_API_KEY');
}

const webpack = require('webpack');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
    }),
  ],
});
