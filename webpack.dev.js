const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CommonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = merge(CommonConfig, {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  devServer: {
    publicPath: path.resolve(__dirname, '/'),
    // Server can be visible also by your IP address in LAN
    host: '0.0.0.0',
    port: 3000,
    hot: true
  },
  entry: {
    examples: './examples/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        use: 'file-loader?name=[path][name].[ext]',
        test: /\.(jpg|png|eot|svg|ttf|woff|woff2|otf|ico)$/
      },
      {
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          // Share SASS variables, mixins and functions with all .sass files
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, 'src/assets/styles/sass-resources.scss'),
            },
          },
        ],
        test: /\.scss$/
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: './examples/index.html',
    })
  ]
});

module.exports = config;
