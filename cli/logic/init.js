const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { prompt } = require("inquirer");
const { abort, print, debug } = require("./../config/utils");
const each = require("lodash/each");
const shell = require("shelljs");

const boilerplateConfigFilesToCopy = [
  // ".browserslistrc", // file is obsolete need to update to v3
  ".babelrc",
  ".editorconfig",
  ".eslintrc.js",
  ".jshintrc",
  ".postcssrc.js",
  ".gitignore",
  "tsconfig.json",
  "valisette.conf.js",
  "public/favicon.ico",
  "public/valisette-logo.png"
];
const boilerplateFoldersToCopy = ["resources/", "webpack/", "tests/"];
const boilerplateFoldersToCreate = ["public", "resources/assets/"];
const boilerplateFilesToRename = [
  {
    before: "./cli/boilerplate/package-boilerplate.json",
    after: "package.json"
  },
  {
    before: "cli/boilerplate/.env.boilerplate",
    after: ".env"
  },
  {
    before: "cli/boilerplate/index-boilerplate.ejs",
    after: "resources/assets/index.ejs"
  },
  {
    before: "cli/boilerplate/index-boilerplate.html",
    after: "public/index-example.html"
  }
];
const postBuildCommands = ["npm i", "npm run watch"];
const cliPath = path.resolve(__dirname, "../../");

const runShellCommands = async newProjectPath => {
  for (let i = 0, len = postBuildCommands.length; i < len; i += 1) {
    await shell.cd(newProjectPath);
    await shell.exec(postBuildCommands[i]);
  }
};

const copySingleFolder = (file, distPath) => {
  const src = path.resolve(`${cliPath}/${file}`);
  const dist = path.resolve(`${distPath}/${file}`);
  const fileIsCopied = new Promise((resolve, reject) => {
    fse.copy(src, dist, err => {
      if (err) {
        abort(err);
        return reject();
      }
      return resolve();
    });
  });
  return fileIsCopied;
};

const copyBuildFiles = async (folders, distPath) => {
  const promises = [];
  for (const folder of folders) { // eslint-disable-line no-restricted-syntax
    print(`Copying folder ${folder} @ ${distPath}`);
    promises.push(copySingleFolder(folder, distPath));
  }
  await Promise.all(promises).then(() => {
    print(`Folders copy done`);
  })
};

const prepareBuildFolders = (buildFolderArray, finalPath) => {
  each(buildFolderArray, folderPath => {
    try {
      fs.mkdirSync(`${finalPath}/${folderPath}`, { recursive: true });
      print(`${folderPath} is created in ${finalPath}`);
    } catch (err) {
      if (err.code !== "EEXIST") throw debug(err);
    }
  });
};

const copyEnvAndConfigFiles = (confFilesArray, finalPath) => {
  each(confFilesArray, file => {
    try {
      fs.copyFileSync(
        path.resolve(`${cliPath}/${file}`),
        `${finalPath}/${file}`
      );
      print(`${file} copied...`);
    } catch (e) {
      abort(e);
    }
  });
};

const renameDefaultConfigFiles = (filesArray, finalPath) => {
  each(filesArray, fileObj => {
    try {
      fs.copyFileSync(
        path.resolve(`${cliPath}/${fileObj.before}`),
        `${finalPath}/${fileObj.after}`
      );
      print(`${fileObj.after} copied...`);
    } catch (e) {
      abort(e);
    }
  });
};

const buildBoilerplate = async (finalPath, folderExistsAlready = false) => {
  if (!folderExistsAlready) {
    fs.mkdirSync(finalPath);
    print(`Project folder created @ ${finalPath}`);
  } else {
    print(`Copying files @ ${finalPath}`);
  }
  prepareBuildFolders(boilerplateFoldersToCreate, finalPath);
  copyEnvAndConfigFiles(boilerplateConfigFilesToCopy, finalPath);
  await copyBuildFiles(boilerplateFoldersToCopy, finalPath).then(() => {
    renameDefaultConfigFiles(boilerplateFilesToRename, finalPath);
    print("Boilerplate build success");
  })
};

const postInstallScripts = async (newProjectPath) => {
  print("Run post-install scripts");
  await runShellCommands(newProjectPath);
  print("Build Completed")
}

const build = async (newProjectPath, folderExistsAlready = false) => {
  try {
    await buildBoilerplate(newProjectPath, folderExistsAlready);
  } catch (e) {
    abort(`Boilerplate build failed @ ${e}`);
  }
};

const init = async folder => {
  const newProjectPath = `${path.resolve(folder)}`;
  await prompt({
    type: "confirm",
    name: "userinput",
    message: `Create new project @ ${newProjectPath} ?`
  })
    .then(async answers => {
      if (answers.userinput) {
        const projectPathExistsAlready = fs.existsSync(newProjectPath);
        if (!projectPathExistsAlready) {
          build(newProjectPath, true).then(() => {
            print("Files copied");
            postInstallScripts(newProjectPath);
            return true;
          })
        } else {
          prompt({
            type: "confirm",
            name: "userinput",
            message: `Folder already exists, are you sure you want to copy files over ${newProjectPath} ?`
          }).then(async confirmation => {
            if (!confirmation.userinput) {
              print("Operation cancelled");
              return false;
            }
            build(newProjectPath, true).then(() => {
              print("Files copied");
              postInstallScripts(newProjectPath);
              return true;
            })
          });
        }
      } else {
        print("Operation cancelled");
        return false;
      }
      return true;
    }).then(() => {
    })
    .catch(e => {
      abort(`Please report this error :`, `\n${e}`);
    });
};

module.exports = {
  init
};
