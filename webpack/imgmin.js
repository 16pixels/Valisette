const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');

(async () => {
  await imagemin(['./resources/assets/images/**/*.jpg'], './public/images', {
    use: [
      imageminMozjpeg()
    ]
  });
  console.log('JPG Images optimized');
})();
(async () => {
  await imagemin(['./resources/assets/images/**/*.png'], './public/images', {
    use: [
      imageminOptipng()
    ]
  });
  console.log('PNG Images optimized');
})();