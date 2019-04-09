import chalk from "chalk";
import shx from "shelljs";

console.log(chalk.magenta.bold(`> Generating a new Valisette configuration`));
shx.cp(`-n`, `./webpack/templates/valisette.default.conf.js`, `./valisette.conf.js`)
