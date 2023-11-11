const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();

const aliases = {};

const js = {
  test: /\.(ts|js)x?$/,
  use: 'babel-loader',
};

module.exports = {
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: aliases,
    roots: [__dirname, path.resolve(__dirname, '/src')],
  },
  entry: path.resolve(__dirname, '/src/index'),
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  module: {
    rules: [
      js,
      {
        test: /\.(mp3|jpg|png)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVER_PORT: JSON.stringify(process.env.SERVER_PORT),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      cache: false,
    }),
  ],
};
