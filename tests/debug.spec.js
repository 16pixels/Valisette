import { shallowMount, createLocalVue } from "@vue/test-utils";
import vuex from "vuex";
import expect from "expect";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import appStore from "./../resources/assets/javascript/vue-app/state/store";
import Home from "./../resources/assets/javascript/vue-app/router/views/home/Home.vue";

const localVue = createLocalVue();
localVue.use(vuex);

describe("Test suite", () => {

  let store;
  let wrapper;
  const mock = new MockAdapter(axios);
  const mockStorage = (() => {
    let sessionStore = {};
    return {
      getItem: key => {
        return sessionStore[key];
      },
      setItem: (key, value) => {
        sessionStore[key] = value.toString();
      },
      clear: () => {
        sessionStore = {};
      }
    };
  })();

  beforeEach(() => {
    store = appStore;
    wrapper = shallowMount(Home, {
      store,
      localVue,
      mocks: { $t: () => "Translated text" }
    });
    mock.reset();
    Object.defineProperty(global.window, "localStorage", {
      value: mockStorage
    });
    Object.defineProperty(global.window, "sessionStorage", {
      value: mockStorage
    });
  });

  it("mounts correctly", () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });
});
