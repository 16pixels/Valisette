---
title: Getting Started
---

# Getting Started

::: warning COMPATIBILITY NOTE
Valisette requires the latest stable node version (a.k.a "Active LTS").
:::

This the standard way to install the project on your machine via npm and serve it from localhost with a self-signed SSL certificate.

## Install cli from npm

Run this command from any folder, it will pull the cli from npm and install it globally.

```bash{4}
# install cli
npm i -g valisette
# create a new project directory
valisette i <project-name>
# or install in existing project directory
valisette i .
```

## Start DNS Mask

After you've installed DNS Mask ``valet``, make it valet has started to link the project and to run it on https.

```bash{4}
# don't paste this line if you've run valet before
valet install
# runs valet service
valet start
# Set valet domains tld to '.app'
valet domain app
cd <valisette-project-directory>
# Serve the boilerplate at https://<valisette-project-directoy-name>.app
valet link
# Enable SSL certification
valet secure
```

## Install project dependencies with npm

Now we will use [Node's package manager](https://npmjs.org) to install the project's dependencies.

Just run those basic commands :
```bash{4}
npm i
# OR
npm install
```

::: tip YARN USAGE
[Yarn](https://yarnpkg.com/) performs better than npm but works just the same. However we will stick to npm support.

```bash{4}
npm i yarn -g
yarn i
# OR
yarn install
```
:::

## Run your first build

Ok it's time run your first build and see the app !

We use [scripts commands](https://yarnpkg.com/lang/en/docs/package-json/#toc-scripts) to command the boilerplate. All the commands are container in ``./package.json`` but we'll look at those in detail later on.

Let's run your first compilation with :

```bash{4}
npm run prod
```

When the compilation is complete, you should open your browser at ``https://<project-directory-name>.app/`` and add a security exception to validate your SSL certificate (this is normal since we have made a self-signed certificate that we can trust when we installed a DNS Mask).

::: tip
On Mac you can also run :

```bash{4}
open https://<project-directory-name>.app
```
:::

Congratulations you've finished your first Valisette Installation ! :tada:
