const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaders = require('./webpack.loaders');

const { rules } = loaders.module;

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';

rules.push({
  test: /\.scss$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'sass-loader' },
  ],
  exclude: /node_modules/,
});

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.jsx', // your app's entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules,
  },
  devServer: {
    contentBase: './public',
    // only output when errors or new compilation happen
    stats: 'minimal',
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
  ],
};
