import rimraf from "rimraf";
import path from "path";
import chalk from "chalk";
import { each } from "lodash";
import { buildConfig } from "./build-config.js";

const _assets = param => {
  return path.resolve(__dirname, `./../../${buildConfig.assetsPath}${param}`);
};
const _base = param => {
  return path.resolve(__dirname, "./../../" + param);
};
const _clean = (param, callback) => {
  var target = path.resolve(__dirname, "./../../" + param);
  var msg1 =
    "> " + chalk.cyan.bold("cleaning   -") + " " + chalk.yellow.bold(target);
  if (buildConfig.verbose) {
    console.log(msg1);
  }
  rimraf(target, function() {
    var msg2 =
      "> " +
      chalk.cyan.bold("cleaned    -") +
      " " +
      chalk.yellow.bold(target);
    if (buildConfig.verbose) {
      console.log(msg2);
    }
    return callback();
  });
};
const _buildEntriesObject = (path, entriesArray) => {
  const resultObject = {};
  each(entriesArray, (key, value) => {
    const finalString = _assets(`${path + key}`);
    const finalKey = key.split(".")[0];
    resultObject[finalKey] = finalString;
  });
  return resultObject;
};
const _buildJsEntriesObject = entriesArray => {
  return _buildEntriesObject(buildConfig.jsPath, entriesArray);
};
const utils = {
  assets: _assets,
  base: _base,
  clean: _clean,
  jsEntries: _buildJsEntriesObject
};
export { utils };
