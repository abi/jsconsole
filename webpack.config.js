var path = require('path');
var webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

module.exports = {
  mode: 'development',
  entry: './src/core/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js',
    library: {
      name: 'webpackNumbers',
      type: 'umd',
    },
    publicPath: '',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader'
          }
        ],
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
