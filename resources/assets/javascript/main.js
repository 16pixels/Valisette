import * as OfflinePluginRuntime from "offline-plugin/runtime";
import each from "lodash/each";
import utils from "./modules/utils";
import { loadFonts, lazyLoader } from "./modules/performance";
import swRuntime from "./sw-runtime";
import VueApp from "./vue-app";

// Add offline mode
OfflinePluginRuntime.install();
swRuntime.init();

// Don't remove this line, it imports css & scss into webpack
require("main_css"); // eslint-disable-line import/no-unresolved

/**
 * @function main
 * @description build the app api and return it as a set of private & public methods
 */
const main = () => {
  /**
   * @namespace publicMethods
   * @description collection of all public methods that you wish to be available from outside the application (therefore made public)
   */
  const publicMethods = {};
  publicMethods.utils = utils;

  /**
   * @namespace privateMethods
   * @description collection of all private methods that you use to launch with
   * a specific method / set of methods with a configuration object pass into from options parameter
   */
  const privateMethods = {
    globals(options) {
      // Loads fonts asynchronously, go check performance.js
      if (options.fontsLoader) {
        loadFonts(options);
      }
      // Lazyloads all images, go check performance.js
      if (options.lazyLoad) {
        lazyLoader(options);
      }
      VueApp.init();
    },
  };

  /**
   * Init function, initialize any method you want with the config object you've given
   * @param  {[type]} methodToStart [description]
   * @return {[type]}                [description]
   */
  const triggerPrivateMethod = method => {
    if (privateMethods[method.name]) {
      utils.Debug(`${method.name} initialized`, method.config);
      if (!method.config) {
        return privateMethods[method.name]({});
      }
      return privateMethods[method.name](method.config);
    }
    utils.ThrowError(`${method.name} does not exist`);
    return false;
  };

  /**
   * @function launcher
   * @description this methods has a an array of configuration objects as a parameter. Each object in this array launches a specific method
   * @param  {array} methodToStart
   */
  const launcher = methodToStart => {
    each(methodToStart, triggerPrivateMethod);
  };

  // Returns the API when function is called
  return {
    launcher,
    publicMethods
  };
};

/**
 * Make an app namespace to work from
 */
const app = {};

/**
 * Attach app to window (optional)
 */
window.app = app;

/**
 * Initialize app and pass it's apy to the app object that's been attached
 * to window object previously so we can use the app from the browser
 */
app.core = main();
app.core.launcher([
  {
    name: "globals",
    config: {
      lazyLoad: true,
      fontsLoader: true
    }
  }
]);
