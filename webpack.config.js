var path = require("path");
const webpack = require('webpack');
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery'
});

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
        {
          test: /\.js$/, 
          exclude: /node_modules/, 
          use: [
            {
              loader: "babel-loader" 
            }
          ]
        },
        {
          test: require.resolve('jquery'),
          use: [
            {
              loader: 'expose-loader',
              options: '$'
            },
            { 
              loader: 'expose-loader', 
              options: 'jQuery' 
            }
          ]
        }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),  // New
  },  
};


