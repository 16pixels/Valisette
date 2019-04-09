import { loadLanguageAsync, i18n } from "./../../../i18n";
import store from "./../../../state/store";
import utils from "./../../../../modules/utils";

const moduleName = "[userLanguageFinderMiddleware] |";

const userLanguageFinderMiddleware = RouterInstance => {
  return RouterInstance.beforeEach((to, from, next) => {
    const findUserLang = () => {
      // get lang param from vue router
      let { lang } = to.params;
      utils.Verbose(
        `${moduleName} route lang => ${lang}`
      );
      // if lang is not set use active or default lang & send it to i18n
      if (lang === undefined) {
        // Format unknown => use default lang
        if (i18n.locale.length > 2) {
          lang = store.getters["language/getDefaultLang"];
          utils.Verbose(
            `${moduleName} default lang => ${lang}`
          );
          return lang;
        }
        lang = i18n.locale;
        // use active
        utils.Verbose(
          `${moduleName} active lang => ${lang}`
        );
        return lang;
      }
      // send vue router lang param to i18n
      return lang;
    };
    utils.Verbose(`${moduleName} checking lang => ${findUserLang()}`);
    return loadLanguageAsync(findUserLang()).then(() => next());
  });
};
export default userLanguageFinderMiddleware;
