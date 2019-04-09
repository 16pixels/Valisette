import config from '../../../../config';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  state: {
    defaultLang: config.defaultLang,
    activeLang: config.defaultLang,
  },
  mutations,
  actions,
  getters,
  namespaced: true
};