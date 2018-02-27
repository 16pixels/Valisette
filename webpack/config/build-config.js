const isProduction = process.env.NODE_ENV === 'prod' ? true : false;
const buildConfig = {
  isProduction,
  publicPath: '/public/', // Public assets folder path
  jsPath: 'javascript/', // Javascript folder name
  tsPath: 'typescript/', // Typescript folder name
  cssPath: 'css/', // Css folder name
  assetsPath: 'resources/assets/', // Assets source location
  watch: process.env.WATCH ? process.env.WATCH : false,
  jsMain: 'main.js', // Main JS file to import / require from
  jsWorker: 'worker.js', // Declares your service worker(s)
  stylesMain: 'styles.js', // Manages lazy loading
  scssPath: 'scss/', // scss source folder
  scssMain: 'main.scss', // Main scss file
  cssMain: 'main.css', // Main css file (used in production mode)
  devtool: isProduction ? '(none)' : 'cheap-eval-source-map', // Sourcemap type declaration
  isPwa: false, // Turn your app into a Progressive Web App
  pwa: {
    appName: 'Jockpack Boilerplate',
    shortAppName: 'Jockpack',
    appDescription: 'Jockpack, multitool webpack config',
    appColor: '#3a74a5',
    themeColor: '#3a74a5',
    appLogo: 'public/images/general/pin.png'
  }
};
export {
  buildConfig
};
