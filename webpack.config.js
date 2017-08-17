const webpack = require('webpack');
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery'
});

module.exports = {
  context: __dirname + '/src',
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
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
  }
};


