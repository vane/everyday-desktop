const webpack = require('webpack');
const Copy = require('copy-webpack-plugin');

const mode = 'development'

module.exports = {
  mode,
  entry: './src/App.jsx',
  output: {
    path: __dirname + '/build',
    filename: 'app.js',
  },
  optimization: {
    minimize: mode == 'development' ? false : true
  },
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname + '/build',
    compress: false,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        exclude: /(node_modules)/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, 'less-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    /*new Copy({
      patterns: [
        {from: 'assets', to: 'build/assets'},
      ]
    }),*/
  ]
}
