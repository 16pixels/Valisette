---
title: Introduction
---
# Introduction

Valisette is composed of 3 parts :
* A build system based on [Webpack 4](https://webpack.js.org/) and [Babel 7](https://babeljs.io/) to use modern Javascript now.
* A Javascript application core written in [ES6](http://es6-features.org/) that enables your build & your [service worker](https://developers.google.com/web/fundamentals/primers/service-workers/) and serves as a performance-oriented platform to load javascript, css & web assets.
* A [Vue.js](https://vuejs.org/v2/guide/) application written in ES6 with [vuex](https://vuex.vuejs.org/), [vue-router](https://router.vuejs.org/) and [vuei18n](https://kazupon.github.io/vue-i18n/introduction.html) configured out of the box for [asynchronous components](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) and [code splitting](https://webpack.js.org/guides/code-splitting/).

## Why did we create it ? 

It was created to answer [16 Pixels](https://16pixels.fr/)'s need to :
* Have a modular boilerplate 
* Make maintainable build system across many code bases.
* Automate most its web performance related work.
* Have new developers & contractors to start coding faster & learn web performance.
* Empower developers to maintain and extend their own build system by having on open webpack config and a strong tool set.
* Open its ideas and knowledge to the outside and make a great open source tool.

## How it works

The boilerplate default configuration is designed to build you an SPA with zero config that hits 100 on all of [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) performance indicators. As you carry on it means to teach by doing all the aspects of web performance on the client side. Ultimately it expects that you will need it for other purposes and becomes a modular tool that can match a different set of expectations out of the box. Therefore all of it's features, it's file system and the way it's build is managed from a single configuration file. It can then rebuild itself from your new configuration in command line.

## Features

##  Todo

Valisette is still a work in progress. There are a few things that it currently does not support but are planned:

* Existing project installation mode
* Compiler only installation mode
* Boilerplate only installation mode
* Modular React support
* Modular Typescript support
* Modular Webpack devserver with HMR support
* [Advanced code splitting](https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758) by making every chunk a bundle

Contributions are welcome!


## Why not ... ?


### Vue-cli

[Vue-cli](https://cli.vuejs.org/) is the official Vue.js Tool chain. It is designed to build SPA's the Vue way and it integrates really well with the vue ecosystem. It uses webpack-chain to manage it's configuration and it is done so to avoid to hustle of having to understand webpack all the way. It has a GUI to support new developers. It supports older version of the internet better and have the maximum maintainability. Overall it's a great tool to learn Vue.js or make large dedicated Vue apps.

### Create-react-app

[Create-react-app](https://facebook.github.io/create-react-app/) is the official go-to boilerplate for the react ecosystem. It is dedicated to react and probably the most advanced and feature heavy boilerplate on the market. It's dedicated to learning react and make react applications. It's update cycle is very fast make it easy to stay on the bleeding edge of new JS features. Overall even though it changes all the time it's the most advanced tool in the JS ecosystem.

### Plain javascript

Remember that plain JS is always the fastest if used the right way. Checkout [VanillaJS](http://vanilla-js.com/) for a reminder. Feel free to let us know if you make great stuff !