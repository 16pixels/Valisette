import MiniCssExtractPlugin from "mini-css-extract-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
/**
 * Import modules
 * @type {[type]}
 */
import { each } from "lodash";
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
 * Plugins declarations
 * @type {ExtractTextPlugin}
 */
const extractSassProd = new MiniCssExtractPlugin({
  filename: `${buildConfig.cssPath + buildConfig.cssMainOutput}`,
  disable: process.env.NODE_ENV === "development",
  publicPath: buildConfig.publicPath + buildConfig.cssPath,
  chunkFilename: `[id].chunk.css`
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
  "@": utils.assets(`${buildConfig.assetsPath + buildConfig.jsPath}`)
};
if (buildConfig.vueRuntime) {
  Object.assign(baseAliasConfig, { vue$: "vue/dist/vue.esm.js" });
}

/**
 * Aliases declarations
 */
const cssAssets = {};
each(buildConfig.scssMain, fileName => {
  const name = `${fileName.split(".")[0]}_css`;
  return Object.assign(cssAssets, {
    [name]: utils.assets(`${buildConfig.scssPath + fileName}`)
  });
});

/**
 * Make vue loader config
 */
const vueloaderConfig = () => {
  if (buildConfig.ExtractCss) {
    // return extractSassProd.loader;
    return {
      loader: MiniCssExtractPlugin.loader,
      options: {
        filename: "css/[name].css",
        publicPath: `${utils.base(buildConfig.publicPath + buildConfig.cssPath)}`,
        chunkFilename: `[id].chunk.css`
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
    main: utils.assets(`${buildConfig.jsPath + buildConfig.jsMain}`)
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        extractComments: false,
        parallel: true,
      }),
    ],
    splitChunks: {
      // CommonsChunkPlugin()
      name: "vendor",
      minChunks: 2,
      chunks: "all"
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true // ModuleConcatenationPlugin
  },
  performance: {
    hints: "error"
  },
  devtool: buildConfig.devtool,
  target: "web",
  output: {
    filename: `${buildConfig.jsPath + buildConfig.jsMainOutput}`,
    path: utils.base(buildConfig.publicPath),
    chunkFilename: `[name].chunk.js`,
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          vueloaderConfig(),
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              importLoaders: 2,
              modules: true,
              localIdentName: "[name]_[local]_[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false
            }
          }
        ]
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
              plugins: ["@babel/plugin-transform-runtime"]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
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
