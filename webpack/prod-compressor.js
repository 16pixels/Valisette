// const imagemin = require('imagemin');
// const imageminMozjpeg = require('imagemin-mozjpeg');

// imagemin(['./public/images/projects/**/*.jpg'], './public/images/projects', {use: [imageminMozjpeg()]}).then(() => {
//   console.log('Images optimized');
// });


const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

imagemin(['./public/portraits/v2/*.jpg'], './public/portraits/v2/build', {use: [imageminMozjpeg(['quality', 84,
  'progressive', true])]}).then(() => {
  console.log('Images optimized');
});
