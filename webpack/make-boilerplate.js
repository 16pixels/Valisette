import chalk from "chalk";
import shx from "shelljs";
import buildConfig from "./config/build-config";

const webpackMode = buildConfig.GENERATE_HTML;
console.log(
  chalk.magenta.bold(
    `> Generating a ${chalk.yellow.bold(
      webpackMode ? "dynamic" : "static"
    )} boilerplate`
  )
);

const basics = () => {
  const publicFolder = buildConfig.publicPath;
  console.log(
    chalk.magenta.bold(
      `> Copying standard assets over ${chalk.yellow.bold(`.${publicFolder}`)}`
    )
  );
  shx.cp(
    `-n`, // do not overwite
    `./webpack/templates/favicon.ico`,
    `.${publicFolder}favicon.ico`
  );
  shx.cp(
    `-n`, // do not overwite
    `./webpack/templates/valisette-logo.png`,
    `.${publicFolder}valisette-logo.png`
  );
};

const cleanFS = () => {
  const publicFolder = buildConfig.publicPath;
  const assetsFolder = buildConfig.assetsPath;
  console.log(
    chalk.magenta.bold(
      `> Clean public folder : ${chalk.yellow.bold(`.${publicFolder}`)}`
    )
  );
  shx.rm("-rf", `.${publicFolder}/**/*`);
  console.log(
    chalk.magenta.bold(
      `> Clean assets folder : ${chalk.yellow.bold(`./${assetsFolder}`)}`
    )
  );
  shx.rm("-rf", `./${assetsFolder}/**/*`);
};

const fileSystem = () => {
  const assetsFolder = buildConfig.assetsPath;
  console.log(
    chalk.magenta.bold(
      `> Composing assets boilerplate from valisette config into : ${chalk.yellow.bold(
        `.${assetsFolder}`
      )}`
    )
  );
  const copyAsset = (type, assetPath) => {
    const fullPath = `./${buildConfig.assetsPath}${assetPath}`;
    const types = ["js", "scss", "images"];
    if (!types.includes(type)) {
      console.log(
        chalk.magenta.bold(
          `> Unknown asset type : ${chalk.yellow.bold(`"${type}"`)}`
        )
      );
      return false;
    }
    console.log(
      chalk.magenta.bold(
        `> Copying ${type} files to : ${chalk.yellow.bold(`.${fullPath}`)}`
      )
    );
    switch (type) {
      case "js":
        return shx.cp(`-rn`, `./webpack/templates/assets/javascript`, `${fullPath}`);
      case "scss":
        return shx.cp(`-rn`, `./webpack/templates/assets/scss`, `${fullPath}`);
      case "images":
        return shx.cp(`-rn`, `./webpack/templates/assets/images`, `${fullPath}`);
      default:
        break;
    }
    return true;
  };
  copyAsset("js", buildConfig.jsPath);
  copyAsset("scss", buildConfig.scssPath);
  copyAsset("images", buildConfig.imagesPath);
};

const staticBoilerplate = () => {
  const assetsFolder = buildConfig.publicPath;
  console.log(
    chalk.magenta.bold(
      `> Copying index.html template over : ${chalk.yellow.bold(
        `.${assetsFolder}`
      )}`
    )
  );
  shx.cp(
    `./webpack/templates/index-template.html`,
    `.${assetsFolder}index.html`
  );
  return true;
};

const webpackBoilerplate = () => {
  const assetsFolder = buildConfig.assetsPath;
  console.log(
    chalk.magenta.bold(
      `> Copying index.ejx template over : ${chalk.yellow.bold(
        `./${assetsFolder}`
      )}`
    )
  );
  shx.cp(`./webpack/templates/index.ejs`, `./${assetsFolder}`);
  return true;
};

const main = () => {
  if (buildConfig.HARD_CLEANUP) {
    cleanFS();
  }
  basics();
  fileSystem();
  if (webpackMode) {
    return webpackBoilerplate();
  }
  return staticBoilerplate();
};

main();
