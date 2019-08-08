const path = require('path');
const fs = require('fs');
const { prompt } = require('inquirer');
const { abort, print, debug } = require('./../config/utils');
const each = require('lodash/each');
const ncp = require('ncp').ncp;
const shell = require('shelljs');

ncp.limit = 16;
const boilerplateConfigFilesToCopy = [
  '.browserslistrc',
  '.babelrc',
  '.editorconfig',
  '.eslintrc.js',
  '.jshintrc',
  '.postcssrc.js',
  '.gitignore',
  'tsconfig.json',
  'valisette.conf.js',
  'public/favicon.ico',
  'public/valisette-logo.png'
];
const boilerplateFoldersToCopy = ['resources/', 'webpack/', 'tests'];
const boilerplateFoldersToCreate = ['public', 'resources/assets/'];
const boilerplateFilesToRename = [
  {
    before: './cli/boilerplate/package-boilerplate.json',
    after: 'package.json'
  },
  {
    before: 'cli/boilerplate/.env.boilerplate',
    after: '.env'
  },
  {
    before: 'cli/boilerplate/index-boilerplate.ejs',
    after: 'resources/assets/index.ejs'
  },
  {
    before: 'cli/boilerplate/index-boilerplate.html',
    after: 'public/index-example.html'
  }
];
const postBuildCommands = [
  'npm i'
];

const init = folder => {
  const finalPath = `${path.resolve(folder)}`;
  prompt({
    type: 'confirm',
    name: 'userinput',
    message: `Create new project @ ${finalPath} ?`
  }).then(async answers => {
    if (answers.userinput) {
      if (!fs.existsSync(finalPath)) {
        const buildBoilerplate = async () => {
          fs.mkdirSync(finalPath);
          print(`Project folder created @ ${finalPath}`);
          each(boilerplateFoldersToCreate, folderPath => {
            try {
              fs.mkdirSync(`${finalPath}/${folderPath}`, { recursive: true })
              print(`${folderPath} is created in ${finalPath}`)
            } catch (err) {
              if (err.code !== 'EEXIST') throw debug(err)
            }
          })
          each(boilerplateConfigFilesToCopy, file => {
            fs
              .copyFile(path.resolve(`./${file}`), `${finalPath}/${file}`, err => {
                if (err) throw debug(err);
                print(`${file} copied to ${finalPath}${file}`);
              })
          });
          each(boilerplateFoldersToCopy, async folderPath => {
            const src = path.resolve(`./${folderPath}`);
            const dist = `${finalPath}/${folderPath}`
            await ncp(src, dist, (err) => {
              if (err) {
                return debug(err);
              }
              print(`${folderPath} is copied over ${finalPath}/${folderPath}`);
              return true;
             });
          })
          each(boilerplateFilesToRename, fileObj => {
            fs
              .copyFile(path.resolve(`./${fileObj.before}`), `${finalPath}/${fileObj.after}`, err => {
                if (err) throw debug(err);
                print(`${fileObj.before} copied to ${finalPath}/${fileObj.after}`);
              })
          })
        }
        await buildBoilerplate();
        const runShellCommands = async () => {
          each(postBuildCommands, async command => {
            await shell.cd(finalPath);
            await shell.exec(command);
          })
        }
        await runShellCommands();
        return true;
      }
      abort('Folder already exists !');
      return false;
    }
    return false;
  });
  return folder;
};

module.exports = {
  init
};
