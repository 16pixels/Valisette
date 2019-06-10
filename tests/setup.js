/**
 * Sets up all the test environment
 */
require("jsdom-global")();

// eslint-disable-next-line func-names
const mock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key];
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', { 
  value: mock,
});
global.sessionStorage = mock;
window.Date = Date;