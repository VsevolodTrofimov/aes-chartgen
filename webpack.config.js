const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, options) => ({
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),

  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }],
  },

  output: {
    path: path.resolve(__dirname, './dist')
  },

  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin([
      { from: __dirname + '/static/', to: __dirname+'/dist/static' }
    ])
  ]
})