import Vue from "vue";
import store from "./state/store";
import router from "./router";
import config from "../config";
import { i18n } from "./i18n";
import App from "./App.vue";
import utils from "./../modules/utils";

// Please read & follow Vue.js's convention before coding : https://vuejs.org/v2/style-guide/index.html

const moduleName = "Vue-app";
const buildApp = selector => {
  utils.Debug(`${moduleName} init with : ${selector}`);
  Vue.locale = () => {};
  Vue.config.productionTip = !config.debug;
  const app = new Vue({
    store,
    router,
    i18n,
    components: {
      App
    },
    mounted() {
      utils.Debug(`${moduleName} mounted`, [this.$store, this.$router]);
      // vuei18n test new langugage method
      // setTimeout(() => {
      //   this.$store.dispatch("language/setActiveLanguage", "fr");
      // }, 3000);
    },
    render: h => h(App)
  }).$mount(String(selector));
  return app;
};

const VueApp = {
  init: () => {
    return buildApp(config.appMountPoint);
  }
};

export default VueApp;
