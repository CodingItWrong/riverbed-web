const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({template: './web/index.html'}),
    new CopyPlugin({
      patterns: [{from: 'public', to: '.'}],
    }),
    // MiniCssExtractPlugin configured via child configs
    new webpack.DefinePlugin({
      'process.env.RIVERBED_GOOGLE_MAPS_API_KEY': JSON.stringify(
        process.env.RIVERBED_GOOGLE_MAPS_API_KEY,
      ),
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      // see https://necolas.github.io/react-native-web/docs/setup/#bundler
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        datePickers: {
          test: /[\\/]node_modules[\\/]@mui[\\/]x-date-pickers/,
          name: 'date-pickers',
          chunks: 'all',
        },
        googleMaps: {
          test: /[\\/]node_modules[\\/]google-maps-react/,
          name: 'google-maps',
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/](?!google-maps-react|@mui[\\/]x-date-pickers)/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
