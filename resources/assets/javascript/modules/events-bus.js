import Vue from "vue";
import config from "./../config";
const EventBus = new Vue();
const bus = {
  on(eventName, fn) {
    try {
      EventBus.$on(eventName, fn);
    } catch (e) {
      if (config.debug) {
        console.error(e);
      }
    }
  },
  off(eventName, fn) {
    try {
      EventBus.$off(eventName, fn);
    } catch (e) {
      if (config.debug) {
        console.error(e);
      }
    }
  },
  emit(eventName, payload) {
    try {
      EventBus.$emit(eventName, payload);
    } catch (e) {
      if (config.debug) {
        console.error(e);
      }
    }
  },
  killAll() {
    try {
      EventBus.$off()
    } catch (e) {
      console.error(e);
    }
  }
};

export default bus;
