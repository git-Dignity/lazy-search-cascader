const path = require("path")
const { VueLoaderPlugin } = require("vue-loader")

// js 文件打包成功后，需要一个 html 文件来引入这个 js 文件
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
 
  entry: ["@babel/polyfill", "./src/main.js"],
  output: {
    path: path.resolve(__dirname + "/dist"),
    filename: "[name].build.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    proxy: {
      // 山洪
      "/wcs/rras/": {
        target: "http://10.44.20.234/",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  module: {
    rules: [
      {
        // *.vue
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" },
        ],
      },
      // 配置图片资源的加载
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
      {
        // js
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  // 解析路径
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".vue"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/index.html",
      favicon: "public/favicon.ico",
    }),
    new VueLoaderPlugin(),
  ],
}
