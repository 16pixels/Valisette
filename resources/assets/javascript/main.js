import {
  utils,
  loadFonts,
  lazyLoader
} from './modules/';
import {
  each
} from 'lodash';
import config from './config';

// Don't remove this line, it imports css & scss into webpack
require('sassAssets');

// attach app to window object so we can use it in the browser
window.app = window.app || {};
const app = window.app;

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
   * a specific module / set of modules with a configuration object pass into from options parameter
   */
  const privateMethods = {
    globals(options) {
      // Loads fonts asynchronously, go check performance.js
      loadFonts(options);
      // Lazyloads all images, go check performance.js
      lazyLoader(options);
    },
    specificPrivateMethod(options) {
      utils.Log(['specificPrivateMethod launched with =>', options]);
      // myImportedModule.init(options);
      // myImportedModule2.init(options);
      // myImportedModule3.init(options);
    }
  };

  /**
   * Init function, initialize any method you want with the config object you've given
   * @param  {[type]} methodToStart [description]
   * @return {[type]}                [description]
   */
  const triggerModule = (module) => {
    if (privateMethods[module.name]) {
      utils.Log([`${module.name} initialized`, module.config]);
      return privateMethods[module.name](module.config);
    }
    utils.Warn([`${module.name} does not exist`]);
    return false;
  };

  /**
   * @function launcher
   * @description this methods has a an array of configuration objects as a parameter. Each object in this array launches a specific method
   * @param  {array} methodToStart
   */
  const launcher = (methodToStart) => {
    each(methodToStart, triggerModule);
  };

  // Returns the API when function is called
  return {
    launcher,
    methods: publicMethods,
  };
};

/**
 * Initialize app and pass it's apy to the app object that's been attached
 * to window object previously so we can use the app from the browser
 */
app.core = main();
app.core.launcher([{
  name: 'globals',
  config: {}
}]);
