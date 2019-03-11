import webfontloader from "webfontloader";
import each from "lodash/each";
import delay from "lodash/delay";
import lazySizes from "lazysizes";
import utils from "./utils";
import config from "../config";

const lazyLoader = () => {
  utils.Debug("lazyLoader init");
  const images = document.querySelectorAll(".lazyload");
  window.requestAnimationFrame(() => {
    lazySizes.init();
    lazySizes.autoSizer.checkElems();
    delay(
      () => {
        each(images, img => {
          window.requestAnimationFrame(() => {
            lazySizes.loader.unveil(img);
          });
        });
      },
      300,
      "later"
    );
  });
};
const loadFonts = () => {
  utils.Debug("webfontLoader init");
  webfontloader.load({
    google: {
      families: config.fontsFamilies
    }
  });
};
export { loadFonts, lazyLoader };
