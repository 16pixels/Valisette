---
title: Commands
---
# Build Commands

Valisette relies on npm scripts contained in ``package.json`` to run.

Each command can be run by ``npm`` or ``yarn``

```bash{2}
yarn run <your-command>
# OR
npm run <your-command>
```

## ``build-debugger``

This command runs the compiler in ``development`` mode with debug flag to watch for plugin deprecation and node internal bugs. It's designed for Valisette maintenance.

## ``build``

This command runs the compiler in ``development`` mode.

## ``prod``

This command runs the compiler in ``production`` mode.

Depending on your ``./valisette.conf.js``, it will : 
* Transpile your JS.
* Transpile your VueJS templates.
* Transpile your TS code.
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

## ``imgmin``

This command runs a script to compress to lossless all images (PNG, JPG, SVG) contained in ``${ASSETS_PATH}/${IMAGES_PATH}`` and output them to ``${PUBLIC_PATH}/${IMAGES_PATH}``.

## ``conf``

This command generates a new configuration file ``./valisette.conf.js `` from default templates for you.

## ``generate``

This command rebuilds all of Valisette default file system for you. It will apply a soft copy over existing file (so that you don't loose anything).

::: warning
If you turn ``HARD_CLEANUP`` in your ``./valisette.conf.js`` which turned off by default, this will purge your filesystem instead of doing a soft copy.
:::

## ``reset``

This command does a full reset of your boilerplate filesystem by doing soft copy of template over your filesystem and minifying images default assets to rebuild public folder entirely. It will use an existing ``./valisette.conf.js`` thus allowing to remodel the boilerplate filesystem the way you want it to be.

## ``clean-node``

This command does a hard cleanup of your ``./node_modules/`` folder.

## ``docs:dev``

This command runs the dev server for your documentation. It serves content from ``./docs/`` folder.

## ``docs:build``

This commands build a production output for your documentation.

## ``docs:publish``

This commands build a production output for your documentation and publish it directly to github (by default Valisette's own documentation). You can edit ``./deploy.sh`` to send your documentation to your own documentation repository.