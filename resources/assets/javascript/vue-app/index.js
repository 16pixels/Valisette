import Vue from "vue";
import store from "./../store";
import Utils from "../modules/utils";

const moduleName = "Core";
window.Vue = require('vue');

const buildApp = (selector, pageName = false) => {
  Utils.Debug(`${moduleName} init with : ${selector}`);
  Vue.locale = () => {};
  Vue.config.productionTip = false;
  new Vue({
    store,
  }).$mount(String(selector));
  pageSwitcher(pageName);
}  

window.document.onreadystatechange = function () {
  Utils.Debug(`${moduleName} - Page Name is : ${pageData.pageName}`);
  buildApp('#app', pageData.pageName);
};
