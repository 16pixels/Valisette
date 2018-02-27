import rimraf from 'rimraf';
import path from 'path';
import chalk from 'chalk';
import { buildConfig } from './build-config.js';

const _assets = (param) => {
  return path.resolve(__dirname, `./../../${buildConfig.assetsPath}${param}`);
};
const _base = (param) => {
  return path.resolve(__dirname, './../../' + param);
};
const _clean = (param, callback) => {
  var target = path.resolve(__dirname, './../../' + param);
  var msg1 = '--> ' + chalk.cyan.bold('cleaning   -') + ' ' + chalk.yellow.bold(target);
  console.log(msg1);
  rimraf(target, function () {
    var msg2 = '--> ' + chalk.cyan.bold('cleaned    -') + ' ' + chalk.yellow.bold(target);
    console.log(msg2);
    return callback();
  });
};
const utils = {
  assets : _assets,
  base : _base,
  clean: _clean
};
export {
  utils
};
