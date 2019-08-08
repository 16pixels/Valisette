#!/usr/bin/env node --harmony

const program = require('commander');
const { init } = require('./logic/init');
const { print, printHelpMessage } = require('./config/utils');

const cli = program;

cli
  .version('1.0.0')

cli
  .command('init [folder]')
  .alias('i')
  .description('Create a new project from scratch')
  .action((folder) => {
    let folderPath = "./valisette-app"
    if (folder) {
      folderPath = folder;
    }
    return init(folderPath);
  })

cli
  .on('--help', () => {
    printHelpMessage();
  });

cli.parse(process.argv);


