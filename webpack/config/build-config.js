import ValisetteConf from "./../../valisette.conf";

require('dotenv').config()

const { env } = process;
const productionMode = env.NODE_ENV === 'prod'; // grab production mode from node envirionnement (cli)

// console.table(env);

const buildConfig = {
  jsMain: ValisetteConf.jsMain, // Main JS file to import / require from
  scssMain: ValisetteConf.scssMain, // Main scss file
  productionMode,
  pwaMode: ValisetteConf.PWA_MODE, // Turn your app into a Progressive Web App
  ExtractCss: ValisetteConf.EXTRACT_CSS, // Extract css/scss from vuejs components
  vueRuntime: ValisetteConf.VUE_RUNTIME, // Use vue template inside html files (true) or render app on a mount point (false)
  appShellMode: ValisetteConf.APP_SHELL_MODE, // Add an html file to follow app shell pattern
  verbose : ValisetteConf.VERBOSE, // log extra info during build
  audit : ValisetteConf.AUDIT, // audit bundled code composition
  ignoreWarnings: ValisetteConf.IGNORE_WARNINGS, // ignore performance recommandations & warnings
  appUrl: ValisetteConf.APP_URL, // app url to specify for service workers
  logLevel: ValisetteConf.PERFORMANCE_LOG_LEVEL, // set performance hints log level
  publicPath: ValisetteConf.PUBLIC_PATH, // Public assets folder path
  publicManifestPath: ValisetteConf.PUBLIC_MANIFEST_PATH, // Public assets manifest location
  jsPath: ValisetteConf.JS_PATH, // Javascript folder name
  tsPath: ValisetteConf.TS_PATH, // Typescript folder name
  cssPath: ValisetteConf.CSS_PATH, // Css folder name
  imagesPath: ValisetteConf.IMAGES_PATH,
  fontsPath: ValisetteConf.FONTS_PATH,
  assetsPath: ValisetteConf.ASSETS_PATH, // source assets files location
  watch: env.WATCH ? env.WATCH : false, // grab watch mode from node (cli)
  jsMainOutput: ValisetteConf.JS_MAIN_ASSETS, // js file output name pattern
  scssPath: ValisetteConf.SCSS_PATH, // scss source folder
  cssMainOutput: ValisetteConf.CSS_MAIN_OUTPUT, // css file output name pattern (used in production mode)
  devtool: productionMode ? '(none)' : 'eval-source-map ', // Sourcemap type declaration
  critical: ValisetteConf.CRITICAL,
  pwa: {
    appName: ValisetteConf.APP_NAME,
    shortAppName: ValisetteConf.SHORT_APP_NAME,
    appDescription: ValisetteConf.APP_DESCRIPTION,
    appColor: ValisetteConf.APP_COLOR,
    themeColor: ValisetteConf.THEME_COLOR,
    appLogo: ValisetteConf.APP_LOGO
  },
  browserSync: { // This implies that you are hosting your code on your machine but you can always set browserSync options -> https://github.com/Va1/browser-sync-webpack-plugin
    target: ValisetteConf.PROXY_TARGET
  },
  performance: {
    compressionTreshold: ValisetteConf.COMPRESSION_THRESHOLD // Minimum chunk size to set compression flag (performs better at 10240 on mobile in our experience)
  }
};
export default buildConfig;
