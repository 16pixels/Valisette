import MiniCssExtractPlugin from "mini-css-extract-plugin";

/**
 * Import modules
 * @type {[type]}
 */
import { each } from "lodash";
import { buildConfig } from "./build-config";
import { utils } from "./build-utils";
import chalk from "chalk";

/**
 * Start config setup
 */
if (buildConfig.verbose) {
  console.log("\n> Assembling webpack basic config\n");
}

/**
 * Plugins declarations
 * @type {ExtractTextPlugin}
 */
const extractSass = new MiniCssExtractPlugin({
  filename: `${buildConfig.cssPath + buildConfig.cssMainOutput}`,
  disable: process.env.NODE_ENV === "development",
  publicPath: buildConfig.publicPath,
  chunkFilename: "[id].css"
});

/**
 * Constants declarations
 * @type {[type]}
 */
// Declares file bundling exclusions pattern
const EXCLUDES = /node_modules|bower_components/;

/**
 * Aliases base config
 */
const baseAliasConfig = {
  vue$: "vue/dist/vue.esm.js", //eslint-disable-line
  "@": utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`)
};

/**
 * Aliases declarations
 */
let cssAssets = {};
each(buildConfig.scssMain, fileName => {
  const name = `${fileName.split(".")[0]}_css`;
  return Object.assign(cssAssets, {
    [name]: utils.assets(`${buildConfig.scssPath + fileName}`)
  });
});

/**
 * Merging Aliases
 */
const aliasesList = [baseAliasConfig, cssAssets];
const mergeAliases = aliasArray => {
  let allAliases = {};
  each(aliasArray, key => {
    Object.assign(allAliases, key);
  });
  if (buildConfig.verbose) {
    console.log("> Listing Aliases : ");
    each(allAliases, (alias, key) => {
      console.log(
        `--> ${chalk.green(chalk.cyan.bold(key))}: `,
        chalk.yellow.bold(alias)
      );
    });
  }
  return allAliases;
};

/**
 * Config object
 * @type {Object}
 */
const config = {
  mode: 'development',
  entry: utils.jsEntries(buildConfig.jsMain),
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: {
      // CommonsChunkPlugin()
      name: "vendor",
      chunks: 'all',
      minChunks: 2
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true //ModuleConcatenationPlugin
  },
  performance: {
    hints: buildConfig.logLevel
  },
  devtool: buildConfig.devtool,
  target: "web",
  output: {
    filename: `${buildConfig.jsPath + buildConfig.jsMainOutput}`,
    path: utils.base(buildConfig.publicPath),
    hashDigestLength: 8,
    pathinfo: true
  },
  resolve: {
    extensions: [".js", ".ts", ".vue", ".json", ".scss"],
    alias: mergeAliases(aliasesList)
  },
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: [
          utils.base("node_modules"),
          utils.assets(`${buildConfig.assetsPath + buildConfig.cssPath}`)
        ],
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          },
          {
            loader: "resolve-url-loader"
          },
        ],
      },
      {
        test: /\.scss$/,
        include: [
          utils.base("node_modules"),
          utils.assets(`${buildConfig.scssPath}`)
        ],
        use:[
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          {
            loader: "css-loader"
          },
          {
            loader: "resolve-url-loader"
          },
          {
            loader: "sass-loader",
            query: {
             sourceMap: false
            }
          }
        ],
      },
      {
        test: /\.ts$/,
        exclude: EXCLUDES,
        include: [
          utils.assets(`${buildConfig.assetsPath + buildConfig.tsPath}`)
        ],
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: EXCLUDES,
        include: [
          utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`)
        ],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.woff$/,
        loader: "url-loader?mimetype=application/font-woff"
      },
      {
        test: /\.ttf$/,
        loader: "url-loader?mimetype=application/font-ttf"
      },
      {
        test: /\.eot$/,
        loader: "url-loader?mimetype=application/font-eot"
      },
      {
        test: /\.svg$/,
        loader: "url-loader?mimetype=iamge/svg"
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      },
      {
        test: /\.jpg$/,
        loader: "url-loader?mimetype=image/jpg"
      },
      {
        test: /\.gif$/,
        loader: "url-loader?mimetype=image/gif"
      }
    ]
  }
};

export { config, extractSass };
