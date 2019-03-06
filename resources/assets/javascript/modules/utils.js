import each from 'lodash/each';
import debounce from 'lodash/debounce';
import once from 'lodash/once';
import { bus } from './pubsub';
import config from './../config';


const utils = {
  pubsub: bus,
  screenDimensions: {
    w: window.innerWidth,
    h: window.innerHeight,
  },
  whichBrowser: () => {
    const inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
    // Log([inBrowser]);
    const UA = inBrowser && window.navigator.userAgent.toLowerCase();
    const isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i)
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    // Log([UA]);
    const theBrowsers = {
      isIE: UA && UA.indexOf('trident') > 0,
      isIE9: UA && UA.indexOf('msie 9.0') > 0,
      isAndroid: UA && UA.indexOf('android') > 0,
      isIOS: UA && /iphone|ipad|ipod|ios/.test(UA),
      isFirefox: UA && UA.indexOf('firefox') > 0,
      isChrome,
      isSafari: UA && UA.indexOf('safari/') > 0 && !isChrome < 0,
    };
    if (theBrowsers.isIOS) {
      document.querySelector('body').classList.add('is-ios');
    }
    if (theBrowsers.isChrome && !isSamsungBrowser) {
      document.querySelector('body').classList.add('is-chrome');
    }
    return theBrowsers;
  },
  observeState: () => {
    document.onreadystatechange = () => {
      utils.pubsub.emit('statechange', document.readyState);
    };
  },
  getScrollPoz: (fps) => {
    const target = document.querySelector('.content-fixed-wrapper');
    const updateFps = fps || 60;
    const timer = 1000 / updateFps;
    const debounceSize = debounce(() => {
      const height = window.innerHeight;
      const scrollTop = target.scrollTop;
      const scrollMid = scrollTop + (height / 2);
      const scrollBot = scrollTop + height;

      utils.pubsub.emit('scroll-update', {
        top: scrollTop,
        mid: scrollMid,
        bot: scrollBot,
      });
    }, timer);

    const runLoop = () => {
      target.addEventListener('scroll', () => {
        debounceSize();
      });
    }

    const init = () => {
      window.requestAnimationFrame(runLoop);
    }

    const run = once(init);
    run();
  },
  Log: (param) => {
    if (config.debug) {
      console.log('(ツ)_/¯', param); // eslint-disable-line
    }
  },
  Warn: (param) => {
    if (config.debug) {
      console.warn('(づ｡◕‿‿◕｡)づ', param); // eslint-disable-line
    }
  },
  Err: (param) => {
    if (config.debug) {
      console.error('(ノಠ益ಠ)ノ彡┻━┻', param); // eslint-disable-line
    }
  },
  DOMLoad: (callback) => {
    if (!callback) {
      utils.Err('DOMLoad has no callback');
    }
    utils.pubsub.on('statechange',  (event) => {
      if (event === 'interactive') {
        window.requestAnimationFrame(callback);
      }
    });
  },
  DOMReady: (callback) => {
    var calls = [];
    if (!callback) {
      utils.Err('DOMLoad has no callback');
      return false;
    } else {
      calls.push(callback);
    }
    utils.pubsub.on('statechange',  (event) => {
      if (event === 'complete') {
        window.requestAnimationFrame(() => {
          each(calls,  (callBack) => {
            return callBack();
          });
        });
      }
    });
  },
  isMobile: () => {
    utils.screenDimensions = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
    const el = document.querySelector('body');
    if (utils.screenDimensions.w <= 768) {
      window.requestAnimationFrame(() => {
        el.classList.add('is-mobile');
      });
      return true;
    }
    window.requestAnimationFrame(() => {
      el.classList.remove('is-mobile');
    });
    return false;
  },
  autoReflower: (callback) => {
    var timeout = 0; // holder for timeout id
    const delay = 100; // delay after event is "complete" to run callback
    window.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          utils.isMobile();
          if (callback) {
            return callback();
          }
        }, delay);
      });
    });
    utils.isMobile();
  },
};
export {
  utils // eslint-disable-line
};
