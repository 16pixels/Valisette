import webpack from 'webpack';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import CleanObsoleteChunks from 'webpack-clean-obsolete-chunks';
import CompressionPlugin from 'compression-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import notifier from 'node-notifier';
import chalk from 'chalk';
import {
  buildConfig
} from './config/build-config';
import {
  utils
} from './config/build-utils';
import {
  config,
  extractSass
} from './config/webpack.config.basics.babel';
import {
  prodConfig,
  extractSassProd,
} from './config/webpack.config.prod.babel';

/** 
 * Compiler object that initialize webpack's as an object
 * @constant
 */
const COMPILER = webpack(config);

/**
 * basics function
 * @function basics
 * @description run basic webpack build tasks
 */
const basics = () => {
  COMPILER.apply(new webpack.ProgressPlugin());
  // Remove useless chunks of code
  COMPILER.apply(new CleanObsoleteChunks());
  // Build an assets manifest so it can be used by back-end
  COMPILER.apply(
    new ManifestPlugin({
      fileName: "mix-manifest.json",
      basePath: buildConfig.publicPath,
      seed: {
        name: "Build assets manifest"
      }
    })
  );
  // Apply concatenation strategy to modules contained in webpack chunks
  COMPILER.apply(new webpack.optimize.ModuleConcatenationPlugin());
};

/**
 * Run function
 * @description executes run methods from webpack library if given object is a valid webpack instance.
 * @function run
 * @param {Object} compilerObject 
 */
const run = (compilerObject) => {
  if (typeof compilerObject.run !== 'function') {
    console.error(chalk.red.bold("\n>>>>>>>>>>>>>>>>>>>>> ! error ! >>>>>>>>>>>>>>>>\n"));
    console.error(chalk.red.bold(` ! Your config is invalid as it has not inherited from webpack methods and it can't run, make sure ./webpack/config/build-config.js is well written ! `));
    console.error(chalk.red.bold("\n>>>>>>>>>>>>>>>>>>>>> !  END  ! >>>>>>>>>>>>>>>>\n"));
    return false;
  }
  compilerObject.run((err, stats) => {
    if (err) {
      console.error(err);
    }
    // Notify user if there are errors during compilation
    if (stats.compilation.errors && stats.compilation.errors[0]) {
      notifier.notify({
        title: "Jockpack",
        message: "Warning Build !"
      });
      console.log(
        chalk.red.bold(
          "\n>>>>>>>>>>>>>>>>>>>>> ! warnings ! >>>>>>>>>>>>>>>>\n"
        )
      );
      console.log(chalk.green.bold(stats.compilation.errors));
      console.log(
        chalk.red.bold(
          "\n>>>>>>>>>>>>>>>>>>>>>>>> END  >>>>>>>>>>>>>>>>>>>>>>\n"
        )
      );
    } else {
      console.log(
        chalk.cyan.bold(
          "\n>>>>>>>>>>>>>>>>> Build complete ! >>>>>>>>>>>>>>>>>\n"
        )
      );
    }
    // Logging function
    if (stats) {
      const time = chalk.cyan.bold(stats.endTime - stats.startTime + " ms");
      console.log("> compiled in", time);
    }
    console.log("> COMPILER done");
  });
};

/**
 * Build function
 * @function build
 * @description Run standard build tasks
 */
const build = () => {
  console.log('> development build');
  basics();
  // Retrieve css chunks and loads them into a single file with ExtractTextPlugin
  COMPILER.apply(extractSass);
  // Run COMPILER function
  run(COMPILER);
};

/**
 * productionBuild
 * @function productionBuild
 * @description run production version of our webpack build
 */
const productionBuild = () => {
  console.log("> production build");
  basics();
  // Retrieve css chunks and loads them into a single file with ExtractTextPlugin and apply minification
  COMPILER.apply(extractSassProd);
  // Makes a smaller webpack footprint by giving modules hashes based on the relative path of each module
  COMPILER.apply(new webpack.HashedModuleIdsPlugin());
  // Minify JS code
  COMPILER.apply(new UglifyJSPlugin());
  // Build up a progressive webapp if you've set it to true in build-config
  if (buildConfig.isPwa) {
    COMPILER.apply(
      new WebpackPwaManifest({
        filename: "manifest-pwa.json",
        orientation: "portrait",
        display: "standalone",
        start_url: "/",
        inject: true,
        fingerprints: false,
        ios: false,
        publicPath: null,
        name: buildConfig.pwa.appName,
        short_name: buildConfig.pwa.shortAppName,
        description: buildConfig.pwa.appDescription,
        background_color: buildConfig.pwa.appColor,
        theme_color: buildConfig.pwa.themeColor,
        icons: [{
            src: utils.base(buildConfig.pwa.appLogo),
            sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
          },
          {
            src: utils.base(buildConfig.pwa.appLogo),
            size: "1024x1024" // you can also use the specifications pattern
          }
        ]
      })
    );
  }

  // Makes a compressed (gzip) version of assets so you can serve them instead of server side generation
  COMPILER.apply(
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240 // Only assets bigger than this size are processed
    })
  );

  run(COMPILER);
}

const watch = () => {
  console.log("> bundling assets");

  basics();

  COMPILER.apply(extractSass);

  if (process.env.WATCH) {
    // build a proxy for your code with hot reload
    COMPILER.apply(
      new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development,
        // ./public directory is being served
        host: "localhost",
        port: 3000,
        proxy: "http://16pixels.dev"
      })
    );
  }
  const watching = COMPILER.watch({
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
    (err, stats) => {
      if (err) {
        console.error(err);
      }
      if (stats.compilation.errors && stats.compilation.errors[0]) {
        var errors = stats.compilation.errors.length + " erreurs !";
        notifier.notify({
          title: "Erreur build",
          message: errors
        });
        console.log(
          chalk.red.bold(
            "\n>>>>>>>>>>>>>>>> ! errors / warnings ! >>>>>>>>>>>>>>>>\n"
          )
        );
        console.log(chalk.green.bold(stats.compilation.errors));
        console.log(
          chalk.red.bold(
            "\n>>>>>>>>>>>>>>>>>>>>>>>> END  >>>>>>>>>>>>>>>>>>>>>>\n"
          )
        );
      } else {
        console.log(
          chalk.cyan.bold(
            "\n>>>>>>>>>>>>>>>>> Build complete ! >>>>>>>>>>>>>>>>>\n"
          )
        );
      }
      if (stats) {
        var time = chalk.cyan.bold(stats.endTime - stats.startTime + " ms");
        console.log("> compiled in", time);
      }
    }
  );
}

// Run pre-build tasks to get file system ready and put thread on hold while its not done
const runPreBuildSteps = new Promise(function (resolve, reject) {
  let goSignal = false;

  // Cleans file system synchronously through callbacks
  const cleaner = () => {
    console.log("> cleaning assets");
    // Clean css folder
    return utils.clean(`${buildConfig.publicPath + buildConfig.cssPath}/*` , function () {
      // Clean js folder
      utils.clean(`${buildConfig.publicPath + buildConfig.jsPath}/*`, function () {
        goSignal = true;
        return resolve("--> folders cleaned");
      });
    });
  };
  return cleaner();
});

// Runs compiler when pre-build tasks are done
runPreBuildSteps.then(function (result) {
  console.log('> checking env');
  console.log(
    '-->', 
    chalk.cyan.bold(`JS source  -`),
    chalk.yellow.bold(`${buildConfig.assetsPath + buildConfig.jsPath + buildConfig.jsMain}`));
  console.log(
    '-->',
    chalk.cyan.bold(`CSS source -`),
    chalk.yellow.bold(`${buildConfig.assetsPath + buildConfig.scssPath + buildConfig.scssMain}`)
  );
  console.log(
    '-->',
    chalk.cyan.bold('prod       -'),
    chalk.yellow.bold(buildConfig.isProduction));
  console.log(
    '-->', 
    chalk.cyan.bold('watch      -'),
    chalk.yellow.bold(buildConfig.watch));
    
  if (buildConfig.isProduction) {
    return productionBuild();
  }
  if (buildConfig.watch && !buildConfig.isProduction) {
    return watch();
  }
  return build();
});
