export default {
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/home/Home.vue")
    },
    {
      path: "*",
      name: "404",
      redirect: "/"
    }
  ]
};
