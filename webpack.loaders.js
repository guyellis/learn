module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/(node_modules|bower_components|public\/)/],
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader?importLoaders=1' },
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'file-loader' },
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'url-loader?prefix=font/&limit=5000' },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      },
      {
        test: /\.gif/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'url-loader?limit=10000&mimetype=image/gif' },
      },
      {
        test: /\.jpg/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'url-loader?limit=10000&mimetype=image/jpg' },
      },
      {
        test: /\.png/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'url-loader?limit=10000&mimetype=image/png' },
      },
    ],
  },
};
