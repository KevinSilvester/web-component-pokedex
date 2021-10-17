const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
   mode: "production",
   entry: {
      app: "./src/js/index.js"
   },
   output: {
      filename: "js/[name].[contenthash].js",
      path: path.resolve(__dirname, "./dist"),
      assetModuleFilename: 'img/[hash][ext][query]',
      clean: true,
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: 'css/[name].[contenthash].css',
      }),
   ],
   module: {
      rules: [
         {
            test: /\.s[ac]ss$/i,
            use: [
               MiniCssExtractPlugin.loader,   // 3. Creates creates new css file
               "css-loader",     // 2. Translates CSS into CommonJS
               {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      config: path.resolve(__dirname, "./postcss.config.js"),
                    },
                  },
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
   devtool: 'source-map',
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