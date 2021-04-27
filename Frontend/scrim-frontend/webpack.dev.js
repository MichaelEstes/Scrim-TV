const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  output: {
    publicPath: "/"
  },
  devtool: "inline-source-map",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      "/api/**": {
        target: "https://example.tv/",
        secure: true
      }
    }
  }
});
