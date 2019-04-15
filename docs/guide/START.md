---
title: Getting Started
---

# Getting Started

::: warning COMPATIBILITY NOTE
Valisette requires the latest stable node version (a.k.a "Active LTS").
:::

This the standard way to install the project on your machine via git and serve it from localhost with a self-signed SSL certificate.

## Clone from git

Run this command from your work folder, it will pull the repository from git and clone it on your machine.

```bash{4}
# cd <your-favorite-work-folder>
git clone git@github.com:16pixels/Valisette.git
cd Valisette
```

## Start DNS Mask

After you've installed DNS Mask ``valet``, make it valet has started to link the project and to run it on https.

```bash{4}
# valet install # uncomment this line if you've never run valet before to finish its installation
valet start # runs valet service
valet domain app # this allows you to serve the boilerplate at https://valisette.app
valet link # make sure you run this from your project folder to host its contents
valet secure # turns traffic to https with a self signed cert
```

## Install project dependencies with npm

Now we will use [Node's package manager](https://npmjs.org) to install ``yarn`` globally on your machine and install the project's dependencies.

[Yarn](https://yarnpkg.com/) performs better than npm but works just the same.

```bash{4} 
npm i yarn -g
yarn i
# OR
yarn install
```

::: tip
This would work as well with :
```bash{4}
npm i
# OR
npm install
```
:::

## Run your first build

Ok it's time run your first build and see the app !

We use [scripts commands](https://yarnpkg.com/lang/en/docs/package-json/#toc-scripts) to command the boilerplate. All the commands are container in ``./package.json`` but we'll look at those in detail later on. 

Let's run your first compilation with :

```bash{4}
yarn run prod
```

When the compilation is complete, you should open your browser at ``https://valisette.app/`` and add a security exception to validate your SSL certificate (this is normal since we have made a self-signed certificate that we can trust when we installed a DNS Mask).

::: tip
On Mac you can also run : 

```bash{4}
open https://valisette.app
```
:::

Congratulations you've finished your first Valisette Installation ! :tada:
