const productionMode = process.env.NODE_ENV === 'prod';
const critical = process.env.CRITICAL === true;
const buildConfig = {
  productionMode,
  pwaMode: true, // Turn your app into a Progressive Web App
  vueRuntime: false, // Use vue template inside html files (true) or render app on a mount point (false)
  appShellMode: true, // Add an html file to follow app shell pattern
  verbose : false, // log extra info during build
  audit : false, // audit bundled code composition
  ignoreWarnings: true,
  appUrl: "https://valisette.app",
  logLevel: "error",
  publicPath: '/public/', // Public assets folder path
  publicManifestPath: '/', // Public assets manifest location
  jsPath: 'javascript/', // Javascript folder name
  tsPath: 'typescript/', // Typescript folder name
  cssPath: 'css/', // Css folder name
  imagesPath: 'images/',
  fontsPath: 'fonts/',
  assetsPath: 'resources/assets/', // source assets files location
  watch: process.env.WATCH ? process.env.WATCH : false,
  jsMain: [
    'main.js',
  ], // Main JS file to import / require from
  jsMainOutput: '[name].js', // js file output name pattern
  jsWorker: 'worker.js', // Declares your service worker(s)
  stylesMain: 'styles.js', // Manages lazy loading
  scssPath: 'scss/', // scss source folder
  scssMain: [
    'main.scss',
  ], // Main scss file
  cssMainOutput: '[name].css', // css file output name pattern (used in production mode)
  devtool: productionMode ? '(none)' : 'eval-source-map ', // Sourcemap type declaration
  critical,
  pwa: {
    appName: 'Valisette by Thibzzz',
    shortAppName: 'Valisette',
    appDescription: 'Valisette :  : a boilerplate for valet & vue users by Thibzzz. https://github.com/thibzzz',
    appColor: '#3a74a5',
    themeColor: '#3a74a5',
    appLogo: 'public/valisette-logo.png'
  },
  browserSync: { // This implies that you are hosting your code on your machine but you can always set browserSync options -> https://github.com/Va1/browser-sync-webpack-plugin
    target: "https://valisette.app"
  },
  performance: {
    compressionTreshold: 10240 // Minimum chunk size to set compression flag (performs better at 10240 on mobile in our experience)
  }
};
export default buildConfig;
