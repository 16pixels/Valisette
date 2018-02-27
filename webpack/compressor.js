var execFile = require('child_process').execFile;
var mozjpeg = require('mozjpeg');
var each = require('lodash').each;

// execFile(mozjpeg, ['-outfile', './public/images/home/outils_background_all_min.jpg', './public/images/home/outils_background_all.jpg'], function (err) {
//   console.log('Image minified!');
// });
const path = require('path')
const fs = require('fs');
const fsx = require('fs-extra');
const rimraf = require('rimraf');
const dir = './public/images/projects';

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

// read projects folder
fs.readdir(dir, (err, folders) => {
  console.log(folders.length);
  console.dir(folders);
  // find each project
  each(folders, (folder) => {
    const directory = `${dir}/${folder}`;
    console.log(directory);
    // read each project content
    fs.readdir(directory, (err, files) => {
      console.log(files.length);
      console.dir(files);
      let subpath;
      let subfolder;
      let output;
      // minify everything single image
      each(files, (file) => {
        subpath = `${directory}/${file}`;
        subfolder = `${directory}_min`;
        output = `${subfolder}/${file}`;
        mkdirSync(path.resolve(subfolder));
        console.log('testing img', subpath);
        if (subpath.indexOf('.jpg') >= 0) {
          execFile(mozjpeg, ['-outfile', output, subpath], function (err) {
            console.log('Image minified!', file);
          });
        } else {
          fsx.copy(subpath, output, err => {
            if (err) {
              return console.error(err)
            }
            console.log('success!');
          }) // copies file
        }
      });
      let origin = `${directory}`;
      let build = `${directory}_min`;
      setTimeout(() => {
        fsx.move(build, origin, { overwrite: true }, err => {
          if (err) {
            return console.error(err);
          }
          console.log("success!");
        });
      }, 1000);
    });
  });
});
