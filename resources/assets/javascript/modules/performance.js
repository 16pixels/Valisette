import webfontloader from 'webfontloader';
import { each, delay } from 'lodash';
import lazySizes from 'lazysizes';
import { utils } from './utils';

const lazyLoader = () => {
  utils.Log(['lazyLoader init']);
  const images = document.querySelectorAll('.lazyload');
  window.requestAnimationFrame(() => {
    lazySizes.init();
    lazySizes.autoSizer.checkElems();
    delay(() => {
      each(images, (img) => {
        window.requestAnimationFrame(() => {
          lazySizes.loader.unveil(img);
        });
      });
    }, 300, 'later');
  });
};
const loadFonts = () => {
  utils.Log(['webfontLoader init']);
  webfontloader.load({
    google: {
      families: ['Montserrat:400,500,600'],
    },
  });
};
export { loadFonts, lazyLoader };
