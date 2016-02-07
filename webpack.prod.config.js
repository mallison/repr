var webpack = require('webpack');
var path = require("path");

module.exports = {
  context: __dirname,

  entry: [
    './js/main.js',
  ],

  output: {
    path: path.resolve('./js/'),
    filename: "bundle.js",
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: [
            'react',
            'es2015'
          ],
          plugins: [
            'transform-class-properties',
            'transform-object-rest-spread'
          ]
        },
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    fallback: path.join(__dirname, 'node_modules'),
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    fallback: [path.join(__dirname, 'node_modules')],
  }
};
