export default {
  /**
   * MAIN ENTRY FILES (SCSS | JS)
   */
  jsMain: ["main.js"], // Main JS file to import / require from
  scssMain: ["main.scss"], // Main scss file to import / require from
  
  /**
   * DEV SERVER / PROXY
   * */
  PROXY_TARGET: "https://valisette.app",

  /**
   * DEVTOOLS
   * */
  VERBOSE: true, // log extra info during build
  IGNORE_WARNINGS: true, // ignore performance recommandations & warnings
  PERFORMANCE_LOG_LEVEL: "warning", // set performance hints log level

  /**
   * BUILD FEATURES
   * */
  APP_SHELL_MODE: true, // Add an html file to follow app shell pattern
  PWA_MODE: true, // Turn your app into a Progressive Web App
  EXTRACT_CSS: true, // Extract css/scss from vuejs components
  CRITICAL: false,
  COMPRESSION_TRESHOLD: 10240,

  /**
   * VUE JS
   * */
  VUE_RUNTIME: true, // Use vue template inside html files (1) or render app on a mount point (0)

  /**
   * PERFORMANCE
   * */
  AUDIT: false, // audit bundled code composition

  /**
   * FILE SYSTEM
   * */
  PUBLIC_PATH: "/public/", // Public assets folder path
  PUBLIC_MANIFEST_PATH: "/", // Public assets manifest location
  JS_PATH: "javascript/", // Javascript folder name
  TS_PATH: "typescript/", // Typescript folder name
  CSS_PATH: "css/", // Css folder name
  IMAGES_PATH: "images/",
  FONTS_PATH: "fonts/",
  ASSETS_PATH: "resources/assets/", // source assets files location
  SCSS_PATH: "scss/", // scss source folder

  /**
   * NAMING BUILD OUTPUTS
   * */
  JS_MAIN_ASSETS: "[name].js", // js file output name pattern
  CSS_MAIN_OUTPUT: "[name].css", // css file output name pattern (used in production mode)

  /**
   * PWA MANIFEST
   * */
  APP_URL: "https://valisette.app", // app url to specify for service workers
  APP_NAME: "Valisette by Thibzzz",
  SHORT_APP_NAME: "Valisette",
  APP_DESCRIPTION:
    "Valisette :  : a boilerplate for valet & vue users by Thibzzz. https://github.com/thibzzz",
  APP_COLOR: "#3a74a5",
  THEME_COLOR: "#3a74a5",
  APP_LOGO: "public/valisette-logo.png"
};
