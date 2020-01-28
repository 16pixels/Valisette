---
title: Commands
---
# Boilerplate Commands

Valisette relies on npm scripts contained in ``package.json`` to run.

Each command can be run by ``npm`` or ``yarn``

```bash{2}
yarn <your-command>
# OR
npm run <your-command>
```

## ``build-debugger``

This command runs the compiler in development mode with debug flag to watch for plugin deprecation and node internal bugs. It's designed for Valisette's webpack bundler maintenance.

## ``build``

This command runs the compiler in ``development`` mode.

## ``prod``

This command runs the compiler in ``production`` mode.

Depending on your ``./valisette.conf.js``, it will :
* Transpile your JS.
* Transpile your VueJS templates.
* Compile your SCSS (if called from entry files).
* Split your code and turns in into bundles (code splitting).
* Eliminate dead code (tree-shaking).
* Make an SPA index.html file & minify HTML.
* Make a PWA manifest & corresponding assets.
* Minify Javascript, CSS called from code.
* Minify images called from code.
* Minify fonts called from code.
* Minify SVG called from code.
* Make Service Worker & its runtime to enable offline mode.
* Compress output assets to gzip.

## ``watch``

This command runs the compiler in ``development`` mode. Then it :
* watches for changes in your file system to recompile.
* start a Browsersync proxy.

## ``dev``

This command runs the compiler in ``development`` mode. Then it :
* watches for changes in your file system to recompile.
* starts a development server at ``http://localhost:8080`` to serve your code.

## ``imgmin``

This command runs a script to compress to lossless all images (PNG, JPG, SVG) contained in ``${ASSETS_PATH}/${IMAGES_PATH}`` and output them to ``${PUBLIC_PATH}/${IMAGES_PATH}``.

## ``clean-node``

This command does a hard cleanup of your ``./node_modules/`` folder.

## ``test``

Runs your test suites locates in ``./tests/``.

## ``wt``

Run you test suites in watch mode.
