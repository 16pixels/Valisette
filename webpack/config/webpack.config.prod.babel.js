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
  console.log("\n> Assembling webpack prod config\n");
}

/**
 * Plugins declarations
 * @type {ExtractTextPlugin}
 */
const extractSassProd = new MiniCssExtractPlugin({
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
const prodConfig = {
  mode: "production",
  entry: {
    main: utils.assets(`${buildConfig.jsPath + buildConfig.jsMain}`)
  },
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: {
      // CommonsChunkPlugin()
      name: "vendor",
      minChunks: 2
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true //ModuleConcatenationPlugin
  },
  performance: {
    hints: "warning"
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
    extensions: [".js", ".ts", ".vue", ".json", ".scss", ".sass"],
    alias: mergeAliases(aliasesList)
  },
  module: {
    rules: [
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
            loader: "css-loader",
            options: {
              minimize: true,
              modules: false,
              sourceMap: false
            }
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
            loader: "css-loader",
            options: {
              minimize: true,
              modules: false,
              sourceMap: false
            }
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
          loader: "babel-loader",
          options: {
            presets: ["env", "minify"],
            plugins: ["transform-runtime"]
          }
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
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
          'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
        ]
      }
    ]
  }
};

export { prodConfig, extractSassProd };
