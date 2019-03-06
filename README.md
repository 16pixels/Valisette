# Valisette

A webpack 4 build system & boilerplate meant to work with various JS technologies seamlessly.


## Features

Dev server
- [X] Browsersync dev server / proxy

App shell generator
- [X] Service worker generator
- [ ] Critical CSS generator (Documentation in progress || needs more documentation)
- [X] PWA manifest generator
- [X] App cache generator
- [X] Sourcemaps generator

Modern Javascript and optimisations
- [ ] ES5 (IE11) backward compatibility transpiler (Not automated yet)
- [X] ES6 - ES7+ transpiler
- [X] VueJS components transpiler
- [X] Code splitting
- [X] Tree shaking
- [X] Comments removal

Modern CSS
- [X] SCSS compiler
- [X] Components styles extraction
- [X] CSS prefixing

Minification
- [X] CSS minifier
- [X] JS Minifier
- [ ] Image minifier

## Get started

To use Valisette one must have a proper node.js configuration setup on it's local machine.

You can either go to [Node's website](https://nodejs.org/en/) or use Node version manager better known as NVM which can be installed using [this script](https://github.com/creationix/nvm#install-script).

If you use Node as a stand alone make sure you export node & npm to your path's so it can be called from your project directory.

If you use NVM you wanna use 

```
nvm ls-remote
```

This command will list all node's version available for installation. From there you must pick the "LTS" one which means "Long Term Support (schedule)". This is de facto the most stable version you can use at any point in NodeJS development.

## Install Valisette

Clone this repo somewhere on your machine and merge any existing file so Valisette's version prevails

```
# git clone git@gitlab.16pixels.fr:open-source/Valisette.git .
# OR if you're not from our team
git clone https://github.com/Thibzzz/Valisette .
```

## Valisette Configuration

As a build tool, Valisette abstracts many redundants tasks and allows you to solely rely on a single configuration file.

This file is ```webpack/config/build-config.js``` which is shown below, we'll review each feature afterwards.

## Commands 

### Start

Clean your project, install dependencies & compiles your code

### Build

Build your code without minifying it. Then outputs it to your public directory.

### Watch

Starts your Browsersync service & builds your code (with build command) everytime you edit files in ```resources/assets/javascript``` or in ```resources/assets/scss```.

### Prod

Build your code, minifies it and gzips it. Then outputs it to your public directory.

## How do I call my assets 

You have an boilerplate layout in index.example.html that you can use to test out Valisette
