import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from 'terser-webpack-plugin';

/**
 * Import modules
 * @type {[type]}
 */
import path from "path";
import { each } from "lodash";
import chalk from "chalk";
import buildConfig from "./build-config";
import utils from "./build-utils";

/**
 * Start config setup
 */
if (buildConfig.verbose) {
  console.log(
    `\n> ${chalk.magenta.bold("Assembling webpack basics config")}\n`
  );
}

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
  "@": utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`),
  "node_modules": path.join(__dirname, '/node_modules'),
  "uuid": utils.base('node_modules/uuid'),

};
if (buildConfig.vueRuntime) {
  Object.assign(baseAliasConfig, { vue$: "vue/dist/vue.esm.js" });
}

/**
 * Aliases declarations
 */
const cssAssets = {};
each(buildConfig.SCSS_ENTRIES, fileName => {
  const name = `${fileName.split(".")[0]}_css`;
  return Object.assign(cssAssets, {
    [name]: utils.assets(`${buildConfig.scssPath + fileName}`)
  });
});

/**
 * Make vue loader config
 */
const vueloaderConfig = () => {
  if (buildConfig.EXTRACT_CSS) {
    // return extractSassProd.loader;
    return {
      loader: MiniCssExtractPlugin.loader,
      options: {
        filename: buildConfig.cssPath + buildConfig.cssMainOutput,
        publicPath: buildConfig.publicPath,
        chunkFilename: buildConfig.cssPath + buildConfig.cssChunkOutput
      }
    };
  }
  return {
    loader: "vue-style-loader",
    options: {
      sourceMap: false,
      shadowMode: false
    }
  };
};

/**
 * Merging Aliases
 */
const aliasesList = [baseAliasConfig, cssAssets];
const mergeAliases = aliasArray => {
  const allAliases = {};
  each(aliasArray, key => {
    Object.assign(allAliases, key);
  });
  if (buildConfig.verbose) {
    console.log(`> ${chalk.magenta.bold("Listing Aliases :")}`);
    each(allAliases, (alias, key) => {
      console.log(
        `> ${chalk.green(chalk.cyan.bold(key))}: `,
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
  mode: "development",
  entry: utils.jsEntries(buildConfig.JS_ENTRIES),
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    minimizer: [new TerserPlugin()],
    splitChunks: {
      maxSize: buildConfig.DEV_PACKAGES_MAX_SIZE,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true // ModuleConcatenationPlugin
  },
  performance: {
    hints: buildConfig.logLevel,
    maxEntrypointSize: buildConfig.DEV_APP_MAX_SIZE_WARNING,
    maxAssetSize: buildConfig.DEV_PACKAGES_MAX_SIZE
  },
  devtool: buildConfig.devtool,
  target: "web",
  node: {
    fs: "empty"
  },
  output: {
    filename: buildConfig.jsPath + buildConfig.jsMainOutput,
    path: utils.base(buildConfig.publicPath),
    chunkFilename: buildConfig.jsPath + buildConfig.jsChunkOutput,
    hashDigestLength: 8,
    pathinfo: true,
    publicPath: buildConfig.ASSETS_PUBLIC_PATH
  },
  resolve: {
    extensions: [".js", ".ts", ".json", ".vue", ".scss", '.gql', '.graphql', '*', '.mjs'],
    alias: mergeAliases(aliasesList)
  },
  devServer: {
    contentBase: utils.base('public/'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: true, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: "cache-loader" },
          vueloaderConfig(),
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 2,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "fast-sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        include: [
          utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`)
        ],
        use: [
          { loader: "cache-loader" },
          {
            loader: "babel-loader",
            options: {
              'plugins': ['lodash'],
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        exclude: EXCLUDES,
        use: [
          { loader: "cache-loader" },
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.woff$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=application/font-woff"
      },
      {
        test: /\.ttf$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=application/font-ttf"
      },
      {
        test: /\.eot$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=application/font-eot"
      },
      {
        test: /\.svg$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=iamge/svg"
      },
      {
        test: /\.png$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=image/png"
      },
      {
        test: /\.jpg$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=image/jpg"
      },
      {
        test: /\.gif$/,
        exclude: EXCLUDES,
        loader: "url-loader?mimetype=image/gif"
      }
    ]
  }
};

export default config;
