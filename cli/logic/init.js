const path = require('path');
const fs = require('fs');
const { prompt } = require('inquirer');
const { abort, print, debug } = require('./../config/utils');
// const each = require('lodash/each');
const ncp = require('ncp').ncp;
const shell = require('shelljs');

const each = async (array, callback) => {
  for (let index = 0; index < array.length; index+=1) {
    await callback(array[index], index, array); // eslint-disable-line
  }
}

ncp.limit = 16;
const boilerplateConfigFilesToCopy = [
  '.browserslistrc',
  '.babelrc',
  '.editorconfig',
  '.eslintrc.js',
  '.jshintrc',
  '.postcssrc.js',
  'tsconfig.json',
  'valisette.conf.js',
  'public/favicon.ico',
  'public/valisette-logo.png'
];
const boilerplateFoldersToCopy = ['resources/', 'webpack/', 'tests'];
const boilerplateFoldersToCreate = ['public/images', 'resources/assets/'];
const boilerplateFilesToRename = [
  {
    before: 'cli/boilerplate/package-boilerplate.json',
    after: 'package.json'
  },
  {
    before: 'cli/boilerplate/.gitignore-boilerplate',
    after: '.gitignore'
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
  'npm i',
  'npm run build'
];

const init = folder => {
  const workingDir = `${path.resolve(folder)}`;
  const libDir = path.resolve(__dirname, "./../../")
  prompt({
    type: 'confirm',
    name: 'userinput',
    message: `Create new project @ ${workingDir} ?`
  }).then(async answers => {
    if (answers.userinput) {
      if (!fs.existsSync(workingDir)) {
        const buildBoilerplate = async () => {
          fs.mkdirSync(workingDir);
          print(`Project folder created @ ${workingDir}`);
          // Create project folder in working dir
          await each(boilerplateFoldersToCreate, folderPath => {
            try {
              fs.mkdirSync(`${workingDir}/${folderPath}`, { recursive: true })
              print(`${folderPath} is created in ${workingDir}`)
            } catch (err) {
              if (err.code !== 'EEXIST') throw debug(err)
            }
          })
          // Copy boirlerplate config files
          await each(boilerplateConfigFilesToCopy, async file => {
            await fs
              .copyFile(`${libDir}/${file}`, `${workingDir}/${file}`, err => {
                if (err) throw debug(err);
                print(`${file} copied to ${workingDir}/${file}`);
              })
          });
          // Copy boilerplatte assets folders
          await each(boilerplateFoldersToCopy, async folderPath => {
            const src = path.resolve(`${libDir}/${folderPath}`);
            const dist = `${workingDir}/${folderPath}`
            await ncp(src, dist, (err) => {
              if (err) {
                return debug(err);
              }
              print(`${folderPath} is copied over ${workingDir}/${folderPath}`);
              return true;
             });
          })
          // Copy and rename sensible files
          await each(boilerplateFilesToRename, async fileObj => {
            await fs
              .copyFile(path.resolve(`${libDir}/${fileObj.before}`), `${workingDir}/${fileObj.after}`, err => {
                if (err) throw debug(err);
                print(`${fileObj.before} copied to ${workingDir}/${fileObj.after}`);
              })
          })
          print('testing order at end of fn')
        }
        const runShellCommands = async () => {
          print('Installing app')
          each(postBuildCommands, async command => {
            await shell.cd(workingDir);
            await shell.exec(command);
          })
        }
        await buildBoilerplate().then(() => {
          print('testing order at then')
        })
        print('testing order at EOF')
        // await runShellCommands();
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
