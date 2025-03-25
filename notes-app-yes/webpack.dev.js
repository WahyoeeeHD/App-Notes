const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FavIconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new FavIconsWebpackPlugin('./note.svg')
  ],
});
