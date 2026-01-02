const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const SVGSpritemapPlugin = require("svg-spritemap-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  entry: {
    admin: [
      path.resolve(__dirname, "resources/scripts/admin", "index.js"),
      path.resolve(__dirname, "resources/styles/admin", "styles.scss"),
    ],
    frontend: [
      path.resolve(__dirname, "resources/scripts/frontend", "index.js"),
      path.resolve(__dirname, "resources/styles/frontend", "styles.scss"),
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/[name]-bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      // {
      //   test: /\.svg$/,
      //   use: [ '@svgr/webpack', 'url-loader' ],
      // },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              api: "modern",
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(png|jpg|gif|bmp)$/,
        type: "asset/resource",
        generator: {
          filename: "images/bmp/[name][ext]",
        },
      },
    ],
  },

  plugins: [
    new ErrorOverlayPlugin(),
    new SVGSpritemapPlugin("./resources/images/svg/*.svg", {
      output: {
        filename: "images/svg/sprite.svg",
      },
      sprite: {
        prefix: "",
        generate: {
          title: false,
        },
      },
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["scripts/*", "styles/*", "images/*"],
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "resources/images/bmp"),
          to: path.resolve(__dirname, "dist/images/bmp"),
        },
        {
          from: path.resolve(__dirname, "resources/images/svg"),
          to: path.resolve(__dirname, "dist/images/svg"),
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
};
