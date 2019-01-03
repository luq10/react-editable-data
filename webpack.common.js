const path = require('path');

const config = {
  context: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/
      }
    ],
  },
};

module.exports = config;
