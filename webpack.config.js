const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const options = ''

module.exports = {
   target: "web",
   plugins: [
      new HtmlWebpackPlugin({
         filename: "index.html",
         template: "./src/index.html"
      }),
      new WebpackManifestPlugin(options),
   ],
   module: {
      rules: [
         {
            test: /\.html$/i,
            use: ['html-loader'],
         },
         {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource'
         },
      ]
   }
}