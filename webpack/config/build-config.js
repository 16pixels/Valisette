const isProduction = process.env.NODE_ENV === 'prod' ? true : false;
const critical = process.env.CRITICAL ? true : false;
const buildConfig = {
  isProduction,
  logLevel: "error",
  production: isProduction,
  publicPath: '/public/', // Public assets folder path
  publicManifestPath: '/', // Public assets folder path
  jsPath: 'javascript/', // Javascript folder name
  tsPath: 'typescript/', // Typescript folder name
  cssPath: 'css/', // Css folder name
  assetsPath: 'resources/assets/', // Assets source location
  watch: process.env.WATCH ? process.env.WATCH : false,
  jsMain: [
    'main.js',
  ], // Main JS file to import / require from
  jsMainOutput: '[name].js', // Main JS file to import / require from
  jsWorker: 'worker.js', // Declares your service worker(s)
  stylesMain: 'styles.js', // Manages lazy loading
  scssPath: 'scss/', // scss source folder
  scssMain: [
    'main.scss',
  ], // Main scss file
  cssMainOutput: '[name].css', // Main css file (used in production mode)
  devtool: isProduction ? '(none)' : 'eval-source-map ', // Sourcemap type declaration
  isPwa: false, // Turn your app into a Progressive Web App
  critical,
  pwa: {
    appName: 'Jockpack',
    shortAppName: 'Jockpack',
    appDescription: 'Jockpack',
    appColor: '#3a74a5',
    themeColor: '#3a74a5',
    appLogo: 'public/favicon.ico'
  },
  browserSync: { // This implies that you are hosting your code on your machine but you can always set browserSync options -> https://github.com/Va1/browser-sync-webpack-plugin
    target: "https://csg-website.dev"
  },
  performance: {
    compressionTreshold: 0 // Minimum chunk size to set compression flag (performs better at 10240 on mobile in our experience)
  }
};
export {
  buildConfig
};
