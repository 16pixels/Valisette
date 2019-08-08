const each = require('lodash/each');
const figlet = require('figlet');
const chalk = require('chalk');

/**
 * Create a folder to path designated in arguments relative to commadnd execution folder
 * Copy package.json
 * Copy config
 * Mv .env.example to .env
 * Copy templates
 * Run npm i
 */

 const debug = (...msg) => {
  let msgString = '';
  each(msg, (value, key) => {
    if (key === 0) {
      msgString += `${value}`;
    } else {
      msgString += ` ${value}`;
    }
  });
  return console.log(chalk.redBright.bold('Error ::'), msgString);
 }
 const abort = (...msg) => {
  let msgString = '';
  each(msg, (value, key) => {
    if (key === 0) {
      msgString += `${value}`;
    } else {
      msgString += ` ${value}`;
    }
  });
  return console.log(chalk.yellowBright.bold('Aborted ::'), msgString);
 }

const print = (...msg) => {
  let msgString = '';
    each(msg, (value, key) => {
      if (key === 0) {
        msgString += `${value}`;
      } else {
        msgString += ` ${value}`;
      }
    });
    return console.log(chalk.blue.bold('Log ::'), msgString);
}
const printLogo = async () => {
  console.log(figlet.textSync("Valisette", {
    font: 'Calvin S',
    horizontalLayout: 'fitted',
  }, (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
  }));
};
const printHelpMessage = () => {
  console.log('')
  printLogo();
  console.log('')
  console.log(chalk.greenBright.bold('Full documentation link :'));
  console.log(chalk.blueBright.bold('https://16pixels.github.io/Valisette-documentation/guide/'));
  console.log('')
  console.log(chalk.greenBright.bold('Follow us on Github :'))
  console.log(chalk.blueBright.bold(' @16pixels'));
  console.log('')
}
module.exports = {
  print,
  printHelpMessage,
  abort,
  debug
};
