const webpack = require('webpack');
const path = require('path');
const Merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const CommonConfig = require('./webpack.common.js');

const config = Merge(CommonConfig, {
  devtool: 'source-map',
  mode: 'none',
  // optimization: {
  //   minimize: true,
  // }, TODO
  entry: {
    index: './EditableData.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'reactEditableData',
    libraryTarget: 'umd',
  },
  externals: [
    'react',
    'prop-types',
    'immutability-helper',
  ],
  plugins: [
    new CleanWebpackPlugin('dist'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ]
});

module.exports = config;
