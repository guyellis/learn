const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaders = require('./webpack.loaders');

const { rules } = loaders.module;

rules.push({
  test: /\.scss$/,
  use: [
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        outputStyle: 'expanded',
      },
    },
  ],
  exclude: /node_modules/,
});

module.exports = {
  entry: [
    './src/index.jsx',
    './src/index.scss',
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: '[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules,
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
  ],
};
