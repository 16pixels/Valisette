import config from '../../../../config';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  state: {
    debug : config.debug
  },
  mutations,
  actions,
  getters,
  namespaced: true
};