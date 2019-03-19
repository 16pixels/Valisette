import imagemin from "imagemin";
import chalk from "chalk";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import imageminSvgo from "imagemin-svgo";
import buildConfig from "./config/build-config";

const minifyJPG = async () => {
  console.log(
    `> ${chalk.magenta.bold("Minifying assets in :")} ${chalk.yellow.bold(
      buildConfig.assetsPath + buildConfig.imagesPath
    )}`
  );
  await imagemin(
    [`${buildConfig.assetsPath + buildConfig.imagesPath}**/*.jpg`],
    `./${buildConfig.publicPath + buildConfig.imagesPath}`,
    {
      use: [imageminMozjpeg()]
    }
  );
  console.log(`> ${chalk.magenta.bold("JPG Images optimized")}`);
};
const minifyPNG = async () => {
  await imagemin(
    [`${buildConfig.assetsPath + buildConfig.imagesPath}**/*.png`],
    `./${buildConfig.publicPath + buildConfig.imagesPath}`,
    {
      use: [imageminOptipng()]
    }
  );
  console.log(`> ${chalk.magenta.bold("PNG Images optimized")}`);
};
const minifySVG = async () => {
  await imageminSvgo(
    [`${buildConfig.assetsPath + buildConfig.imagesPath}**/*.svg`],
    `./${buildConfig.publicPath + buildConfig.imagesPath}`,
    {
      use: [imageminSvgo()]
    }
  );
  console.log(`> ${chalk.magenta.bold("SVG Images optimized")}`);
};
const runScripts = async () => {
  await minifyJPG();
  await minifyPNG();
  await minifySVG();
};
runScripts().then(() => {
  console.log(
    `> ${chalk.magenta.bold("Minified assets placed in :")} ${chalk.yellow.bold(
      buildConfig.publicPath + buildConfig.imagesPath
    )}`
  );
});
