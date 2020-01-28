import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from 'terser-webpack-plugin';


/**
 * Import modules
 * @type {[type]}
 */
import { each } from "lodash";
import path from 'path';
import chalk from "chalk";
import buildConfig from "./build-config";
import utils from "./build-utils";

/**
 * Start config setup
 */
if (buildConfig.verbose) {
  console.log(`\n> ${chalk.magenta.bold("Assembling webpack prod config")}\n`);
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
const prodConfig = {
  mode: "production",
  entry: {
    main: utils.assets(`${buildConfig.jsPath + buildConfig.JS_ENTRIES}`)
  },
  node: {
    fs: 'empty'
  },
  externals: utils.loadImagesFolder(),
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    namedModules: true, // NamedModulesPlugin()
    minimizer: [new TerserPlugin({
      exclude:EXCLUDES,
      cache: true,
      parallel:true,
      extractComments: false,
    })],
    splitChunks: {
      maxSize: buildConfig.PROD_PACKAGES_MAX_SIZE,
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
    maxEntrypointSize: buildConfig.PROD_APP_MAX_SIZE_WARNING,
    maxAssetSize: buildConfig.PROD_PACKAGES_MAX_SIZE
  },
  devtool: buildConfig.devtool,
  target: "web",
  output: {
    filename: buildConfig.jsPath + buildConfig.jsMainOutput,
    path: utils.base(buildConfig.publicPath),
    chunkFilename: buildConfig.jsPath + buildConfig.jsChunkOutput,
    hashDigestLength: 8,
    pathinfo: false,
    publicPath: buildConfig.ASSETS_PUBLIC_PATH
  },
  resolve: {
    extensions: [".js", ".ts", ".json", ".vue", ".scss", '.gql', '.graphql', '*', '.mjs'],
    alias: mergeAliases(aliasesList)
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
          "style-loader",
          vueloaderConfig(),
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              importLoaders: 2,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: false
            }
          },
          {
            loader: "fast-sass-loader",
            options: {
              sourceMap: false
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
          {
            loader: "cache-loader"
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "minify"],
              plugins: ["@babel/plugin-transform-runtime", "lodash"]
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
        loader: "url-loader?mimetype=image/svg"
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

export default prodConfig;
