import Vue from 'vue';
import Router from 'vue-router';
import utils from './../../modules/utils';
import Routes from "./routes";

Vue.use(Router);

const moduleName = '[Router] |';
utils.Debug(`${moduleName} Init`);
const AppRouter = new Router(Routes);
/**
 * Middlewares
 */
const runMiddlewares = () => {
  utils.Debug(`${moduleName} Middlewares Init`);
  AppRouter.beforeEach((to, from, next) => {
    utils.Debug(`${moduleName} Route : ${from.name}, ${to.name}`);
    next();
  });
  // middleWare(AppRouter);
};

runMiddlewares();

export default AppRouter;

