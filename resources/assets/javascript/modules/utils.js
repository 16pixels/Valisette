import { each } from 'lodash';
import { bus } from './pubsub';
import config from './../config';


const utils = {
  pubsub: bus,
  screenDimensions: {
    w: window.innerWidth,
    h: window.innerHeight,
  },
  observeState() {
    document.onreadystatechange = () => {
      utils.pubsub.emit('statechange', document.readyState);
    };
  },
  Log(param) {
    if (config.debug) {
      console.log('(ツ)_/¯', param); // eslint-disable-line
    }
  },
  Warn(param) {
    if (config.debug) {
      console.warn('(づ｡◕‿‿◕｡)づ', param); // eslint-disable-line
    }
  },
  Err(param) {
    if (config.debug) {
      console.error('(ノಠ益ಠ)ノ彡┻━┻', param); // eslint-disable-line
    }
  },
  DOMLoad(callback) {
    if (!callback) {
      utils.Err('DOMLoad has no callback');
    }
    utils.pubsub.on('statechange', (event) => {
      if (event === 'interactive') {
        window.requestAnimationFrame(callback);
      }
    });
  },
  DOMReady(callback) {
    let calls = [];
    if (!callback) {
      utils.Err('DOMLoad has no callback');
      return false;
    } else {
      calls.push(callback);
    }
    utils.pubsub.on('statechange', (event) => {
      if (event === 'complete') {
        window.requestAnimationFrame(() => {
          each(calls, (callBack) => {
            return callBack();
          });
        });
      }
    });
  },
  isMobile() {
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
  autoReflower(callback) {
    let timeout = 0; // holder for timeout id
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
