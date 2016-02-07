var webpack = require('webpack');
var path = require("path");

module.exports = {
  context: __dirname,

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server',
    './js/main.js',
  ],

  output: {
    path: path.resolve('./js/'),
    filename: "bundle.js",
    publicPath: 'http://localhost:3000/js/',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          "react-hot",
          "babel?presets[]=react&presets[]=es2015&plugins[]=transform-class-properties&plugins[]=transform-object-rest-spread"
        ]
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
