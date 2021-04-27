const BabelPlugin = require("babel-webpack-plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor_app",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new BabelPlugin({
      test: /\.js$/,
      presets: [
        [
          "env",
          {
            exclude: ["transform-regenerator"],
            loose: true,
            modules: false,
            targets: {
              browsers: [">1%"]
            },
            useBuiltIns: true
          }
        ]
      ],
      sourceMaps: false,
      compact: false
    })
  ]
});
