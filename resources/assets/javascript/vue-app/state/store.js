import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global"

/**
 * Activate vue state store management (Vuex)
 */
Vue.use(Vuex);

// Please avoid logic in mutations (it should be in actions) & follow conventions
// Please namespace all your modules
// Follow strict mode to avoid scaling problems

export default new Vuex.Store({
  strict: true,
  namespaced: true,
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    global
  },
});
