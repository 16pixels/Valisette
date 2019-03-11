import Vue from "vue";
import store from "./state/store";
import Utils from "../modules/utils";
import config from "../config";

// Please read & follow Vue.js's convention before coding : https://vuejs.org/v2/style-guide/index.html

const moduleName = "Vue-app";
window.Vue = require('vue');

const buildApp = (selector) => {
  Utils.Debug(`${moduleName} init with : ${selector}`);
  Vue.locale = () => {};
  Vue.config.productionTip = !config.debug;
  new Vue({
    store,
    mounted() {
      Utils.Debug(`${moduleName} mounted`, this.$store.getters)
    }
  }).$mount(String(selector));
}

const VueApp = {
  init : () => {
    buildApp(config.appMountPoint);
  }
}

export default VueApp;