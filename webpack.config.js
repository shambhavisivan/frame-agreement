const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

let config = {
  mode: process.env.NODE_ENV,
  entry: {
    bundle: ["./src/index.js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
        loader: "url-loader?limit=100000",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: __dirname + "/src/dist",
    publicPath: "/",
    filename: "[name].js",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new ZipPlugin({
      path: "../../salesforce/src/staticresources",
      filename: "FrameAgreementResource",
      extension: "resource",
    }),
  ],
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
};

if (process.env.NODE_ENV === "development") {
  config.plugins.push(
    new HtmlWebpackPlugin({ template: "src/local-server/index.html" })
  );
  config.devtool = "source-map";
  config.entry.bundle.unshift("./src/local-server/local_data.js");

  const devServerConfig = {
    devServer: {
      port: 2020,
      open: true,
    },
  };

  config = { ...config, ...devServerConfig };
}

if (process.env.NODE_ENV === "production") {
  config.entry["DynamicGroup"] =
    "./src/components/customTabs/dynamicGroupTab/DynamicGroupTab.js";
  config.entry["DiscountCodes"] =
    "./src/components/customTabs/discountCodesTab/DiscountCodesTab.js";
}

module.exports = config;