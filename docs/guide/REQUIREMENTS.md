---
title: Requirements
---
# Getting started

Valisette is meant to be accessible for beginners too. So this page will run you through for a full system installation from scratch.

Valisette only needs nodejs to run but you might need other pieces of technology to enhance your developper experience. The requirements listed here are meant to give you the full experience.

## Get a machine that runs a UNIX system

We developed Valisette for UNIX based OS (so MacOS and Linux) therefore we do not officially support a Windows environment though it can work on Windows 10.

::: tip
If you still want to use Win10, we've made it work with a [ubuntu shell](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/).
:::

## Install Homebrew

We highly recommend you to use [Homebrew](https://brew.sh/) to run our code and install its requirements.

Then to test your installation run :
```bash{4}
brew doctor
```

If there are any problem with your setup, this command should explain you how to fix them.

::: tip
If you're on Linux, don't use a fork. There is also an official [installation guide](https://docs.brew.sh/Homebrew-on-Linux).
:::

## Install a DNS Mask

If you don't use a webserver on your machine, we expect you to use it in development alongside a [DNS mask](https://en.m.wikipedia.org/wiki/Domain_masking) to simplify our workflow.

We officially use [Laravel Valet](https://laravel.com/docs/5.8/valet) to serve our apps locally in HTTPS,
It's simple to use and you should follow it's documentation to install it.

If you're on linux you can use its [Linux fork](https://github.com/cpriego/valet-linux).


## Install Node.js

### With NVM (recommended)

You can also use [node version manager (NVM)](https://github.com/creationix/nvm) if you want to use different node versions on your machine.

After installing it, you want install node's Long Term Stable version (LTS) by running :

```bash{4}
nvm install stable
nvm use stable
npm -v && node -v # to test things out, it should print node's & npm's version number
```

### With homebrew

Brew can install node for you by running :

```bash{4}
brew update
brew install node
npm -v && node -v # to test things out, it should print node's & npm's version number
```

::: tip
The main reason which brought us to explain this approach, is that the default NodeJs setup requires ``sudo`` to run certain commands. There are of course ways to configure it so it doesn’t need extra privileges but we don’t appreciate googling the exact “spell” every time we want to set things up.
:::

### With the official node installer

Valisette is built on top of [Node.js](https://nodejs.org/en/) so you will also have to install it, you can follow the official site's documentation to install it.

::: warning
If you are installing NodeJS via the installer from [https://nodejs.org/](https://nodejs.org/) then you have to use sudo to make sure that it installs correctly. After that you have to make changes in your system ``$PATH`` by adding the path of the node executable. And if you want to uninstall node then you have track all the files that were created and get rid of them. In short its a long process.
:::

## Troubleshooting

We've linked all the official installers and all the documentation we know of, so your priority should be to first dig into it. However if you stumble upon something unusual, feel free to contact us on github and file an issue.
