const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  target: "web",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: '0.0.0.0',
    port: 8080,
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        //Note:- No wildcard is specified hence will copy all files and folders
        from: "src/assets", //Will resolve to RepoDir/src/assets
        to: "assets", //Copies all files from above dest to dist/assets
      },
    ]),
  ],
};
