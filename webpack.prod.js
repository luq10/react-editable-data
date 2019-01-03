const webpack = require('webpack');
const Merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');

const CommonConfig = require('./webpack.common.js');

const config = Merge(CommonConfig, {
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});

module.exports = config;
