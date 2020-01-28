import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ResourceHintWebpackPlugin from "resource-hints-webpack-plugin";
import CleanObsoleteChunks from "webpack-clean-obsolete-chunks";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import DuplicatePackageCheckerPlugin from "duplicate-package-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OfflinePlugin from "offline-plugin";
import { VueLoaderPlugin } from "vue-loader";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CompressionPlugin from "compression-webpack-plugin";
import WebpackPwaManifest from "webpack-pwa-manifest";
import ManifestPlugin from "webpack-manifest-plugin";
import LodashModuleReplacementPlugin from "lodash-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import chalk from "chalk";
import { each } from "lodash";
import WebpackDevServer from "./../node_modules/webpack-dev-server/lib/Server";
import buildConfig from "./config/build-config";
import utils from "./config/build-utils";

/**
 * Compiler object that initialize webpack's as an object
 * @constant
 */
let COMPILER = {};
utils.print(
  `\n> ${chalk.magenta.bold("Build mode")} : ${chalk.yellow.bold(
    process.env.NODE_ENV
  )}\n`
);
if (buildConfig.productionMode) {
  utils.print(
    `\n> ${chalk.magenta.bold("Build mode")} : ${chalk.yellow.bold(
      process.env.NODE_ENV
    )}\n`
  );
  if (buildConfig.productionMode) {
    utils.print(
      `> ${chalk.magenta.bold("Assembling compiler with prod config\n")}`
    );
    prodConfig = require("./config/webpack.config.prod.babel").default;
    COMPILER = webpack(prodConfig);
    utils.printObject(prodConfig);
  } else {
    utils.print(
      `> ${chalk.magenta.bold("Assembling compiler with dev config\n")}`
    );
    config = require("./config/webpack.config.basics.babel").default;
    if (process.env.WATCH) {
      utils.print(`> ${chalk.magenta.bold("Injecting watch flag\n")}`);
      config.watch = true;
    }
    COMPILER = webpack(config);
    utils.printObject(config);
  }
  COMPILER = webpack(config);
}
if (buildConfig.productionMode) {
  utils.printObject(prodConfig);
} else {
  utils.printObject(config);
}

/**
 * basics function
 * @function basics
 * @description run basic webpack build tasks
 */
const basics = () => {
  new LodashModuleReplacementPlugin().apply(COMPILER);
  if (buildConfig.verbose) {
    new webpack.ProgressPlugin(utils.progressHandler).apply(COMPILER);
  }
  // Remove useless chunks of code
  new CleanObsoleteChunks().apply(COMPILER);
  // add vue loader
  new VueLoaderPlugin().apply(COMPILER);
  // Minify JS code
  new TerserPlugin().apply(COMPILER);
  // remove duplicate plugins
  new DuplicatePackageCheckerPlugin({
    verbose: true,
    emitError: true
  }).apply(COMPILER);
  new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    onErrors: (severity, errors) => {
      const errorsList = errors;
      // You can listen to errors transformed and prioritized by the plugin
      // severity can be 'error' or 'warning'
      if (severity === "warning" && buildConfig.ignoreWarnings) {
        each(errors, (key, index) => {
          if (errors[index].severity === 0) {
            delete errorsList[index];
          }
        });
      }
      if (severity === "error") {
        each(errors, (key, index) => {
          // console.log(errors[index]);
          console.log(chalk.bold.redBright(`ERROR ${index + 1} \n`));
          console.log(chalk.bold.redBright(`Type : ${errors[index].name}`));
          console.log(
            `${chalk.bold.redBright(`@ File : `)}${chalk.bold.greenBright(
              `${errors[index].file}`
            )}`
          );
          console.log(chalk.bold.redBright(`\nOriginal Message : \n`));
        });
      }
      return true;
    }
  }).apply(COMPILER);
  if (buildConfig.productionMode) {
    new OptimizeCssAssetsPlugin().apply(COMPILER);
  }
  // Retrieve css chunks and loads them into a single file with ExtractTextPlugin
  new MiniCssExtractPlugin({
    filename: buildConfig.cssPath + buildConfig.cssMainOutput,
    publicPath: buildConfig.publicPath,
    chunkFilename: buildConfig.cssPath + buildConfig.cssChunkOutput
  }).apply(COMPILER);
  if (buildConfig.GENERATE_HTML) {
    new HtmlWebpackPlugin({
      title: buildConfig.pwa.appName,
      templateParameters: {
        theme_color: buildConfig.pwa.THEME_COLOR,
        public_path: `${buildConfig.ASSETS_PUBLIC_PATH}`
      },
      prefetch: ["**/*.*"],
      // preload: ['**/*.*'],
      fileName: `${buildConfig.publicPath}${buildConfig.HTML_OUTPUT_NAME}`,
      template: `${buildConfig.assetsPath}${buildConfig.HTML_TEMPLATE}`,
      inject: "body",
      base: buildConfig.ASSETS_PUBLIC_PATH,
      meta: {},
      minify: {
        collapseWhitespace: buildConfig.productionMode,
        removeComments: buildConfig.productionMode,
        removeRedundantAttributes: buildConfig.productionMode,
        removeScriptTypeAttributes: buildConfig.productionMode,
        removeStyleLinkTypeAttributes: buildConfig.productionMode,
        useShortDoctype: buildConfig.productionMode
      },
      hash: true,
      cache: true
    }).apply(COMPILER);
    if (buildConfig.productionMode) {
      new ResourceHintWebpackPlugin().apply(COMPILER);
    }
  }
};

/**
 * Plugins that needs to load in last order are set here
 */
const endFilePlugins = () => {
  // Build an assets manifest so it can be used by back-end
  new ManifestPlugin({
    fileName: "mix-manifest.json",
    basePath: buildConfig.publicPath,
    seed: {
      name: "Build assets manifest"
    }
  }).apply(COMPILER);
  // add offline mode
  if (buildConfig.OFFLINE_MODE && buildConfig.productionMode) {
    new OfflinePlugin({
      appShell: buildConfig.GENERATE_HTML
        ? `${buildConfig.ASSETS_PUBLIC_PATH}${buildConfig.HTML_OUTPUT_NAME}`
        : false,
      responseStrategy: "cache-first",
      safeToUseOptionalCaches: true,
      caches: {
        main: [":rest:"],
        externals: [":externals:"]
      },
      ServiceWorker: {
        events: true
      }
    }).apply(COMPILER);
  }
};

/**
 * Run function
 * @description executes run methods from webpack library if given object is a valid webpack instance.
 * @function run
 * @param {Object} compilerObject
 */
const run = compilerObject => {
  if (typeof compilerObject.run !== "function") {
    console.error(
      chalk.bold.redBright(
        "\n>>>>>>>>>>>>>>>>>>>>> ! error ! >>>>>>>>>>>>>>>>\n"
      )
    );
    console.error(
      chalk.red.bold(
        ` ! Your config is invalid as it has not inherited from webpack methods and it can't run, make sure ./webpack/config/build-config.js is well written ! `
      )
    );
    console.error(
      chalk.bold.redBright(
        "\n>>>>>>>>>>>>>>>>>>>>> !  END  ! >>>>>>>>>>>>>>>>\n"
      )
    );
    return false;
  }
  return compilerObject.run((err, stats) => {
    utils.prettyPrintErrors(err, stats);
  });
};

/**
 * Build function
 * @function build
 * @description Run standard build tasks
 */
const build = () => {
  // define node ENV as a fallback for older plugins
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: '"development"'
    }
  }).apply(COMPILER);
  // Run shared basic tasks
  basics();
  // warn about performance logs
  utils.print(
    `\n> ${chalk.magenta.bold(
      "Reminder :"
    )} some errors & warnings are inherent to devtools like sourcemaps.\n\n`
  );
  // add end of file plugins
  endFilePlugins();
  // Run the assembled compiler
  return run(COMPILER);
};

/**
 * productionBuild
 * @function productionBuild
 * @description run production version of our webpack build
 */
const productionBuild = () => {
  // Desactivate DEV mode globally
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: '"production"'
    }
  }).apply(COMPILER);
  // Run shared basic tasks
  basics();
  // Makes a smaller webpack footprint by giving modules hashes based on the relative path of each module
  new webpack.HashedModuleIdsPlugin().apply(COMPILER);
  // Build up a progressive webapp if you've set it to true in build-config
  if (buildConfig.PWA_MODE) {
    new WebpackPwaManifest({
      filename: "manifest-pwa.json",
      orientation: "portrait",
      display: "standalone",
      start_url: ".",
      inject: true,
      fingerprints: false,
      ios: false,
      publicPath: buildConfig.ASSETS_PUBLIC_PATH,
      name: buildConfig.pwa.appName,
      short_name: buildConfig.pwa.shortAppName,
      description: buildConfig.pwa.appDescription,
      background_color: buildConfig.pwa.BACKGROUND_COLOR,
      theme_color: buildConfig.pwa.THEME_COLOR,
      icons: [
        {
          src: utils.base(buildConfig.pwa.appLogo),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        },
        {
          src: utils.base(buildConfig.pwa.appLogo),
          size: "1024x1024" // you can also use the specifications pattern
        }
      ]
    }).apply(COMPILER);
  }

  // Makes a compressed (gzip) version of assets so you can serve them instead of server side generation
  new CompressionPlugin({
    filename: "[path].gz[query]",
    algorithm: "gzip",
    exclude: /\/excludes/,
    cache: true,
    compressionOptions: { level: 9 },
    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$/,
    threshold: buildConfig.performance.compressionTreshold // Only assets bigger than this size are processed
  }).apply(COMPILER);

  endFilePlugins();

  return run(COMPILER);
};

const devServer = () => {
  basics();
  new webpack.HotModuleReplacementPlugin().apply(COMPILER);
  config = require("./config/webpack.config.basics.babel").default;
  const devServerOptions = Object.assign({}, config.devServer, {
    open: true,
    stats: {
      colors: true
    }
  });
  const server = new WebpackDevServer(COMPILER, devServerOptions);
  server.listen(buildConfig.devServer.DEV_SERVER_PORT, '127.0.0.1', () => {
    console.log(`\n> ${chalk.magenta.bold(`Starting server on ${chalk.yellow.bold(`http://localhost:${buildConfig.devServer.DEV_SERVER_PORT}`)}`)}`);
  });
  endFilePlugins();
}

const watch = () => {
  utils.print(`\n> ${chalk.magenta.bold("Watching assets")}\n`);
  basics();

  // build a proxy for your code with hot reload
  if (buildConfig.browserSync.target) {
    new BrowserSyncPlugin({
      browser: "google chrome",
      logLevel: "info",
      logConnections: true,
      logFileChanges: true,
      logPrefix: "Valisette",
      proxy: {
        target: buildConfig.browserSync.target
      },
      watchOptions: {
        awaitWriteFinish: true,
        files: ["./resources"]
      },
      open: false,
      cors: false,
      notify: false
    }).apply(COMPILER);
  }

  endFilePlugins();

  // Watch daemon
  const watching = COMPILER.watch(
    {
      aggregateTimeout: 300,
      poll: 400
    },
    (err, stats) => {
      // Pass any errors and stats to console
      utils.prettyPrintErrors(err, stats);
    }
  );
  return watching;
};

// Run pre-build tasks to get file system ready and put thread on hold while its not done
const runPreBuildSteps = new Promise(resolve => {
  // Cleans file system synchronously through callbacks
  if (buildConfig.verbose) {
    utils.print(`> ${chalk.magenta.bold("Cleaning assets")}\n`);
  }
  // Clean css folder
  await utils.clean(
    `${buildConfig.publicPath + buildConfig.cssPath}/*`,
    () => {}
  );
  await utils.clean(`${buildConfig.publicPath}/*.chunk.*`, () => {});
  await utils.clean(
    `${buildConfig.publicPath + buildConfig.jsPath}/*`,
    () => {}
  );
  utils.print(`\n> ${chalk.magenta.bold("Assets cleaned")}`);
};

const main = async () => {
  await makeCompiler().catch(e => {
    utils.print("error", e);
  });
  await runPreBuildSteps().then(() => {
    // Runs compiler when pre-build tasks are done
    if (buildConfig.verbose) {
      utils.print(`\n> ${chalk.magenta.bold("Loading env")}\n`);
      utils.print(
        ">",
        chalk.cyan.bold(`JS source  -`),
        chalk.yellow.bold(
          `${buildConfig.assetsPath + buildConfig.jsPath} |`,
          buildConfig.jsMain
        )
      );
      utils.print(
        ">",
        chalk.cyan.bold(`CSS source -`),
        chalk.yellow.bold(
          `${buildConfig.assetsPath + buildConfig.scssPath} |`,
          buildConfig.scssMain
        )
      );
      utils.print(
        ">",
        chalk.cyan.bold("prod       -"),
        chalk.yellow.bold(buildConfig.productionMode)
      );
      utils.print(
        ">",
        chalk.cyan.bold("watch      -"),
        chalk.yellow.bold(buildConfig.watch)
      );
    }
    // Clean css folder
    return utils.clean(
      `${buildConfig.publicPath + buildConfig.cssPath}/*`,
      () => {
        utils.clean(`${buildConfig.publicPath}/*.chunk.*`, () => {
          // Clean js folder
          utils.clean(
            `${buildConfig.publicPath + buildConfig.jsPath}/*`,
            () => {
              utils.print(`\n> ${chalk.magenta.bold("Assets cleaned")}`);
              return resolve();
            }
          );
        });
      }
    );
  };
  return cleaner();
});

    if (buildConfig.audit) {
      utils.print(
        `\n> ${chalk.magenta.bold("Audit mode ")}${chalk.yellow.bold("ON")}\n`
      );
      new BundleAnalyzerPlugin().apply(COMPILER);
    }

    if (buildConfig.runServer) {
      return devServer();
    }

    if (buildConfig.productionMode) {
      return productionBuild();
    }
    if (buildConfig.watch && !buildConfig.productionMode) {
      return watch();
    }
    return build();
  });
};
try {
  main().catch(e => {
    utils.print("error", e);
  });
} catch (e) {
  console.log("fatal flaw", e);
}
