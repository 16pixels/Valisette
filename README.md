# Jockpack

A webpack 3 build system meant to work with various JS technologies seamlessly.

## Get started

To use Jockpack one must have a proper node.js configuration setup on it's local machine.

*Warning : Jockpack is not meant to be used server side as it's a build system setup. It contains numerous pieces of software that are vulnerabilities if used as such.*

You can either go to [Node's website](https://nodejs.org/en/) or use Node version manager better known as NVM which can be installed using [this script](https://github.com/creationix/nvm#install-script).

If you use Node as a stand alone make sure you export node & npm to your path's so it can be called from your project folder.

If you use NVM you wanna use 

```
nvm ls-remote
```

This command will list all node's version available for installation. From there you must pick the "LTS" one which means "Long Term Support (schedule)". This is de facto the most stable version you can use at any point in NodeJS development.

## Configure Jockpack

Configure your build system in webpack/config/build-config.js


