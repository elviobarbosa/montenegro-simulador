const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'js/frontend/index': './assets/js/frontend/index.js',
    'css/frontend': './assets/scss/frontend.scss'
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: '[name].js'
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
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
              outputPath: 'css/'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'assets/scss')]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.scss']
  }
};
