const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(common, {
   mode: "development",
   entry: {
      app: "./src/js/index.js"
   },
   output: {
      filename: "js/[name].[contenthash].js",
      path: path.resolve(__dirname, "./dist"),
      assetModuleFilename: 'img/[name][ext]',
      clean: true,
   },
   module: {
      rules: [
         {
            test: /\.s[ac]ss$/i,
            use: [
               "style-loader",   // 3. Creates `style` nodes from JS strings
               "css-loader",     // 2. Transpiles CSS into CommonJS
               {
                  loader:"postcss-loader",
                  options: {
                     postcssOptions: { 
                        config: path.resolve(__dirname, "./postcss.config.js"),
                     }
                  }
               },
               "sass-loader",    // 1. Compiles Sass to CSS
            ],
         },
         {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource'
         },
      ]
   },
   optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
         cacheGroups: {
            vendor: {
               test: /[\\/]node_modules[\\/]/,
               name: 'vendors',
               chunks: 'all',
            },
         },
      },
   },
   devServer: {
      port: 8080,
      contentBase: path.resolve(__dirname, "./dist"),
      watchContentBase: true,
      inline: true,
      liveReload: true,
      open: true,
      hot: true
   }
});