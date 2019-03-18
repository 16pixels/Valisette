// import home from "./views/home.vue";
export default {
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/home.vue")
    },
    {
      path: "*",
      name: "404",
      redirect: "/"
    }
  ]
};
