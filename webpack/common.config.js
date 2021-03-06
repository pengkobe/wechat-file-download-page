// webpack plugins
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
module.exports = {

  entry: {
    'app': [
      './src/bootstrap.js'
    ],
    'vendor': ['./static/assets/vendor/flexible.js','./src/vendor.js']// './static/assets/vendor/pdf.js', './static/assets/vendor/pdf.worker.js'
  },

  resolve: {

    extensions: ['.js', '.scss'],

    modules: ['node_modules']

  },

  module: {

    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{loader:'babel-loader',options:{compact: true}}] //, 'eslint-loader'
      },

      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },

      {
        test: /\.(mp4|webm)$/,
        loader: 'url-loader?limit=10000'
      }

    ]

  },

  plugins: [
    new CommonsChunkPlugin({
      name: ['app', 'vendor'],
      minChunks: Infinity
    })
  ]

};
