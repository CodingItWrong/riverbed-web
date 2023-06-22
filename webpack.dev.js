require('dotenv').config({path: './.env.local'});

const webpack = require('webpack');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ],
});
