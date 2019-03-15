/* eslint-disable */
import home from "./views/home.vue";
export default {
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "*",
      name: "404",
      redirect: "/"
    }
  ]
};
