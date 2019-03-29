import buildConfig from "./../../../../webpack/config/build-config";

const config = {
  debug: !buildConfig.productionMode, // auto cuts debug mode in production
  fontsFamilies: ["Montserrat:400,500,600"],
  appMountPoint: "#app",
  defaultLang: 'en'
};
export default config;
