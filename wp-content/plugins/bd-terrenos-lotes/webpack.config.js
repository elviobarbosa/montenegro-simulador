const path = require('path');

module.exports = {
  entry: './assets/js/src/main.js',
  output: {
    filename: 'terreno-admin.bundle.js',
    path: path.resolve(__dirname, 'assets/js/dist'),
    library: 'TerrenoMapApp',
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  externals: {
    jquery: 'jQuery'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  }
};
