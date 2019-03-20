import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import CleanObsoleteChunks from "webpack-clean-obsolete-chunks";
import CircularDependencyPlugin from "circular-dependency-plugin";
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
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import notifier from "node-notifier";
import webpack from "webpack";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import each from "lodash/each";
import buildConfig from "./config/build-config";
import utils from "./config/build-utils";
import config from "./config/webpack.config.basics.babel";
import prodConfig from "./config/webpack.config.prod.babel";

/**
 * Error printing function
 */
const prettyPrintErrors = (err, stats) => {
  let finalStatsLog = "";
  // Notify user if there are errors during compilation
  if (stats.compilation.errors && stats.compilation.errors[0]) {
    notifier.notify({
      title: "Valisette",
      message: `Build has ${stats.compilation.errors.length} error(s) !`
    });
    finalStatsLog += `\n> ${chalk.magenta.bold(
      `Build has ${chalk.yellow.bold(stats.compilation.errors.length)} errors`
    )}\n`;
  }
  if (
    stats.compilation.warnings &&
    stats.compilation.warnings[0] &&
    !buildConfig.ignoreWarnings
  ) {
    notifier.notify({
      title: "Valisette",
      message: `Build has ${stats.compilation.warnings.length} warning(s) !`
    });
    finalStatsLog += `\n> ${chalk.magenta.bold(
      `Build has ${chalk.yellow.bold(
        stats.compilation.warnings.length
      )} warnings`
    )}\n`;
  }
  if (
    !stats.compilation.errors ||
    !stats.compilation.warnings ||
    buildConfig.ignoreWarnings
  ) {
    finalStatsLog = `> ${chalk.green.bold("All good, great job !")}\n`;
  }
  console.log(finalStatsLog);
  // performance logging function
  if (stats) {
    const time = chalk.yellow.bold((stats.endTime - stats.startTime) / 1000);
    console.log(
      `> ${chalk.magenta.bold("Built in ")}${time} ${chalk.magenta.bold(
        "sec"
      )}\n`
    );
  }
  console.log(`> ${chalk.magenta.bold("Build complete")}\n`);
};

/**
 * Compiler object that initialize webpack's as an object
 * @constant
 */
let COMPILER = {};
console.log(
  `\n> ${chalk.magenta.bold("Build mode")} : ${chalk.yellow.bold(
    process.env.NODE_ENV
  )}\n`
);
// let mergedConfig = false;
if (buildConfig.productionMode) {
  // merge both config by using smart merge strategy so that the second object always win
  // mergedConfig = merge.smart(config, prodConfig);
  COMPILER = webpack(prodConfig);
} else {
  COMPILER = webpack(config);
}
if (buildConfig.verbose && prodConfig) {
  console.log(prodConfig);
  each(prodConfig.module.rules, rule => {
    console.log(rule);
  });
}

/**
 * basics function
 * @function basics
 * @description run basic webpack build tasks
 */
const basics = () => {
  new webpack.ProgressPlugin().apply(COMPILER);
  // Remove useless chunks of code
  new CleanObsoleteChunks().apply(COMPILER);
  // add vue loader
  new VueLoaderPlugin().apply(COMPILER);
  // avoid circular references
  new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // allow import cycles that include an asyncronous import,
    // e.g. via import(/* webpackMode: "weak" */ './file.js')
    allowAsyncCycles: false,
    // set the current working directory for displaying module paths
    cwd: process.cwd()
  }).apply(COMPILER);
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
    }
  }).apply(COMPILER);
  // Retrieve css chunks and loads them into a single file with ExtractTextPlugin
  if (buildConfig.ExtractCss) {
    new MiniCssExtractPlugin({
      filename: buildConfig.cssPath + buildConfig.cssMainOutput,
      publicPath: buildConfig.publicPath,
      chunkFilename: buildConfig.cssPath + buildConfig.cssChunkOutput
    }).apply(COMPILER);
  }
};

/**
 * end of file functions
 */
const makeMainCachedAssetsManifest = () => {
  const filesList = [];
  // load js
  each(buildConfig.jsMain, file => {
    filesList.push(`.${buildConfig.publicPath + buildConfig.jsPath + file}`);
  });
  // load css
  each(buildConfig.scssMain, file => {
    const fileName = file.split(".")[0];
    filesList.push(
      `.${buildConfig.publicPath + buildConfig.cssPath + fileName}.css`
    );
  });
  // load images
  const imageFolderUrl = `.${path.resolve(
    `${buildConfig.publicPath + buildConfig.imagesPath}`
  )}`;
  fs.readdirSync(imageFolderUrl).forEach(file => {
    filesList.push(
      `.${buildConfig.publicPath + buildConfig.imagesPath + file}`
    );
  });
  const favicon = `./${buildConfig.pwa.appLogo}`;
  filesList.push(favicon);
  if (buildConfig.verbose) {
    console.log(`> ${chalk.magenta.bold("Main cached assets : ")}`);
    console.table(filesList);
  }
  return filesList;
};
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
  if (buildConfig.appShellMode) {
    new OfflinePlugin({
      safeToUseOptionalCaches: true,
      caches: {
        main: makeMainCachedAssetsManifest(),
        additional: [],
        externals: [],
        optional: []
      },
      ServiceWorker: {
        events: true
      },
      AppCache: {
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
      chalk.red.bold("\n>>>>>>>>>>>>>>>>>>>>> ! error ! >>>>>>>>>>>>>>>>\n")
    );
    console.error(
      chalk.red.bold(
        ` ! Your config is invalid as it has not inherited from webpack methods and it can't run, make sure ./webpack/config/build-config.js is well written ! `
      )
    );
    console.error(
      chalk.red.bold("\n>>>>>>>>>>>>>>>>>>>>> !  END  ! >>>>>>>>>>>>>>>>\n")
    );
    return false;
  }
  return compilerObject.run((err, stats) => {
    prettyPrintErrors(err, stats);
  });
};

/**
 * Build function
 * @function build
 * @description Run standard build tasks
 */
const build = () => {
  basics();
  console.log(
    `\n> ${chalk.magenta.bold(
      "Reminder :"
    )} some errors & warnings are inherent to devtools like sourcemaps.\n\n`
  );
  // add end of file plugins
  endFilePlugins();
  // Run COMPILER function
  run(COMPILER);
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
  new OptimizeCssAssetsPlugin().apply(COMPILER);
  // Run common tasks
  basics();
  // Makes a smaller webpack footprint by giving modules hashes based on the relative path of each module
  new webpack.HashedModuleIdsPlugin().apply(COMPILER);
  // Minify JS code
  new UglifyJSPlugin({
    uglifyOptions: {
      safari10: true,
      ecma: 5,
      ie8: false
    }
  }).apply(COMPILER);
  // Build up a progressive webapp if you've set it to true in build-config
  if (buildConfig.pwaMode) {
    new WebpackPwaManifest({
      filename: "manifest-pwa.json",
      orientation: "portrait",
      display: "standalone",
      start_url: "/",
      inject: true,
      fingerprints: false,
      ios: false,
      publicPath: "/public/",
      name: buildConfig.pwa.appName,
      short_name: buildConfig.pwa.shortAppName,
      description: buildConfig.pwa.appDescription,
      background_color: buildConfig.pwa.appColor,
      theme_color: buildConfig.pwa.themeColor,
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
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    threshold: buildConfig.performance.compressionTreshold // Only assets bigger than this size are processed
  }).apply(COMPILER);
  endFilePlugins();
  return run(COMPILER);
};

const watch = () => {
  console.log(`\n> ${chalk.magenta.bold("Watching assets")}\n`);

  basics();

  if (!process.env.WATCH) {
    console.error(
      chalk.red.bold("\n>>>>>>>>>>>>>>>>>>>>> ! error ! >>>>>>>>>>>>>>>>\n")
    );
    console.error(
      chalk.red.bold(
        ` ! You called watch function but your Node environment is not sending a watch variable in process.env.WATCH ! `
      )
    );
    console.error(
      chalk.red.bold("\n>>>>>>>>>>>>>>>>>>>>> !  END  ! >>>>>>>>>>>>>>>>\n")
    );
    return false;
  }

  // build a proxy for your code with hot reload
  new BrowserSyncPlugin({
    browser: "google chrome",
    proxy: {
      target: buildConfig.browserSync.target,
      ws: true
    },
    logConnections: true,
    logFileChanges: true,
    open: false,
    reloadThrottle: 500,
    cors: false,
    notify: false
  }).apply(COMPILER);

  endFilePlugins();

  // Watch daemon
  const watching = COMPILER.watch(
    {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
    (err, stats) => {
      prettyPrintErrors(err, stats);
    }
  );
  return watching;
};

// Run pre-build tasks to get file system ready and put thread on hold while its not done
const runPreBuildSteps = new Promise(resolve => {
  // Cleans file system synchronously through callbacks
  const cleaner = () => {
    if (buildConfig.verbose) {
      console.log(`> ${chalk.magenta.bold("Cleaning assets")}\n`);
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
              console.log(`\n> ${chalk.magenta.bold("Assets cleaned")}`);
              return resolve();
            }
          );
        });
      }
    );
  };
  return cleaner();
});

// Runs compiler when pre-build tasks are done
runPreBuildSteps.then(() => {
  if (buildConfig.verbose) {
    console.log(`\n> ${chalk.magenta.bold("Loading env")}\n`);
    console.log(
      ">",
      chalk.cyan.bold(`JS source  -`),
      chalk.yellow.bold(
        `${buildConfig.assetsPath + buildConfig.jsPath} |`,
        buildConfig.jsMain
      )
    );
    console.log(
      ">",
      chalk.cyan.bold(`CSS source -`),
      chalk.yellow.bold(
        `${buildConfig.assetsPath + buildConfig.scssPath} |`,
        buildConfig.scssMain
      )
    );
    console.log(
      ">",
      chalk.cyan.bold("prod       -"),
      chalk.yellow.bold(buildConfig.productionMode)
    );
    console.log(
      ">",
      chalk.cyan.bold("watch      -"),
      chalk.yellow.bold(buildConfig.watch)
    );
  }

  if (buildConfig.audit) {
    console.log(
      `\n> ${chalk.magenta.bold("Audit mode ")}${chalk.yellow.bold("ON")}\n`
    );
    new BundleAnalyzerPlugin().apply(COMPILER);
  }

  if (buildConfig.productionMode) {
    return productionBuild();
  }
  if (buildConfig.watch && !buildConfig.productionMode) {
    return watch();
  }
  return build();
});
