import rimraf from "rimraf";
import path from "path";
import chalk from "chalk";
import { each } from "lodash";
import buildConfig from "./build-config";

const assets = param => {
  return path.resolve(__dirname, `./../../${buildConfig.assetsPath}${param}`);
};
const base = param => {
  return path.resolve(__dirname, `./../../${param}`);
};
const clean = (param, callback) => {
  const target = path.resolve(__dirname, `./../../${param}`);
  const msg1 =
    `> ${chalk.cyan.bold("cleaning   -")} ${chalk.yellow.bold(target)}`;
  if (buildConfig.verbose) {
    console.log(msg1);
  }
  rimraf(target, () => {
    const msg2 =
    `> ${chalk.cyan.bold("cleaning   -")} ${chalk.yellow.bold(target)}`;
    if (buildConfig.verbose) {
      console.log(msg2);
    }
    return callback();
  });
};
const buildEntriesObject = (pathString, entriesArray) => {
  const resultObject = {};
  each(entriesArray, (key) => {
    const finalString = assets(`${pathString + key}`);
    const finalKey = key.split(".")[0];
    resultObject[finalKey] = finalString;
  });
  return resultObject;
};
const buildJsEntriesObject = entriesArray => {
  return buildEntriesObject(buildConfig.jsPath, entriesArray);
};
const utils = {
  assets,
  base,
  clean,
  jsEntries: buildJsEntriesObject
};
export default utils;
