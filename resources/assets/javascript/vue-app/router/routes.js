/* eslint-disable */
const routes = {
  routes: [
    {
      path: '/',
      component: () => import('./views/home'),
    },
    {
      path: '*',
      redirect: '/',
    },
  ]
};

export default routes;