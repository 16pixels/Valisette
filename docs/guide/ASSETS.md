---
title: Handling Assets
---

# Handling Assets

While you can just use your own app setup and move along with its build system, Valisette provides its own app structure out of the box.

## JS Files

Javascript Files are located in ``${ASSETS_PATH}/${JS_PATH}`` Folder.

### Main

Your *Main* App File (or entry) is ``${ASSETS_PATH}/${JS_PATH}/main.js`` by default.
If you need to build multiple apps you can create other files there and declare them in ``JS_ENTRIES``.

It's where all your application is supposed to be built from. Whether it's a single animation script of an Business-Scale Vue App. It is separated from your Vue code and therefore should be considered as your *Main* file.

It is also where you're supposed to call your corresponding SCSS entry file from so that Webpack can turn it into a module and compile it down to CSS.

We've added a collection of utilies and performance oriented code in the module folder by default to boot your productivity.

Feel free to use them ! :tada:

### Modules

Javascript Modules that need to be executed outside your Vue Application should be store in ``${ASSETS_PATH}/${JS_PATH}/modules``. This ensures you to keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns).

## Service Worker

Service Worker API allows to perform a lot of modern task such as offline caching, push notifications, events handling and so on. It's also a way to use a new Thread for resources heavy operations. It works only in HTTPS.

### SW control file

The SW control file allows to control interactions between your app and its service worker it's call ``sw.js`` by default and located in ``${ASSETS_PATH}/${JS_PATH}``. It will also make use of the ``appcache`` folder inside your ``${PUBLIC_PATH}`` folder.

### SW Initialization

Your service worker need to be called at the top of your *Main* and boot with these lines of code :

```js{2}
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();
```

It is based on Webpack 4 [OfflinePlugin](https://github.com/NekR/offline-plugin).

## VueJS Files

Javascript Files are located in ``${ASSETS_PATH}/${JS_PATH}/vue-app`` Folder. It's meant to separate Vue code from Plain Javascript code and keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns).

### Vue App Main

Your Vue *Main* is where you boot your app. We made it in a way to be able to call it when we need it by larger code base instead of running it like an SPA the way most boilerplate are made. It is located in ``${ASSETS_PATH}/${JS_PATH}/vue-app`` and called ``index.js`` by default.

It binds all your Vue code together in a single app. You may refer to standard [VueJS Documentation](https://vuejs.org/v2/guide/) to use it.

### Application State (Vuex)

This section explains where your Vue application state is managed by Vuex, its code located in ``${ASSETS_PATH}/${JS_PATH}/vue-app/state/store.js``.
You can use [Vuex Official Documentation](https://vuex.vuejs.org/api/) to configure it.

Valisette sets a couple of things by convention to keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns) :
* State is never global, it's always a module.
* Modules are namespaced.
* Modules are composed of actions that are the core of their logic.
* If a Module needs a lot of logic, extract its functions into a separate file called ``moduleNameFolder/logic.js`` that you will import as a module.
* Actions can dispatch other actions and perform asynchronous tasks.
* Actions never set the state, Mutations do.
* Mutations always modify a **single** state key.
* Getters always return a single state key.
* Getters never perform complex transformation on a state key value, application logic does with computed properties and watchers.
* Actions, Getters, Mutations and State are always separated and returned by the state file.

If you have problem naming your functions remember to read the documentation inside the boilerplate code to help you.

### Application Router (Vue-router)

This section explains where your Vue application routing is managed by Vue-router, its code is located in ``${ASSETS_PATH}/${JS_PATH}/vue-app/router/index.js``.
You can use [Vue-router Official Documentation](https://router.vuejs.org/) to configure it.

Valisette sets a couple of things by convention to keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns) :
* Your routes are in written in ````${ASSETS_PATH}/${JS_PATH}/vue-app/router/routes.js``.
* All routes are asynchronous to allow code splitting.
* Always code a 404 page.
* If a route contains multiple subroutes
* Middlewares are always registered from ``${ASSETS_PATH}/${JS_PATH}/vue-app/router/index.js``.
* Middlewares are always imported from their own folder just like the example from Valisette's default setup ``${ASSETS_PATH}/${JS_PATH}/vue-app/router/middlewares/user-language-finder/index.js``.

Vue router is called in ``${ASSETS_PATH}/${JS_PATH}/vue-app/App.vue`` and mounted by your Vue App Main (see above).

### Vue-i18n

This section explains where your Vue application languages is managed by Vuei18n, its code is located in ``${ASSETS_PATH}/${JS_PATH}/vue-app/i18n/index.js``.
You can use [Vuei18n Official Documentation](https://kazupon.github.io/vue-i18n/introduction.html) to configure it.

Valisette sets a couple of things by convention to keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns) :
* Languages are always loaded asynchronously to lighten main bundle's size.
* Languages files are always names ``lang-<new-language>.js`` and stored in ``${ASSETS_PATH}/${JS_PATH}/vue-app/i18n/languages/``. This is quite important as it allows Valisette to bundle your languages in a way they can be auto declared and imported with zero conf by your build system.

### Vue Templates

This section explains where your Vue application templates are store, its code is located in ``${ASSETS_PATH}/${JS_PATH}/vue-app/views/``.

Valisette sets a couple of things by convention to keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns) :
* Each *Layout* is named in PascalCase. A *Layout* is a distinctive part of UI in an application.
* Each route that serves a new *Layout* needs a subfolder in ``${ASSETS_PATH}/${JS_PATH}/vue-app/views/``.
::: tip Example 
Home.vue &#x2260; Dashboard.vue &#x2260; Auth.vue

Each one needs a sub-folder so you'll create : 
* ``home/Home.vue``, 
* ``dashboard/Dashboard.vue``, 
* ``auth/Auth.vue``
:::

* If a Layout needs a *subLayout* specific to itself, it will be placed in the same folder and name in snakeCase.

:::tip Example
```md{2}
| views/
--| home/
----| Home.vue
----| subNav.vue
----| loginForm.vue
--| dashboard/
----| Dashboard.vue
----| visitStatistics.vue
----| loginForm.vue
```
:::

* All transversal components that could be called on multiple *Layout* or *subLayouts* should store in the includes folder in ``${ASSETS_PATH}/${JS_PATH}/vue-app/views/includes``

## SCSS Files

Javascript Files are located in ``${ASSETS_PATH}/${SCSS_PATH}`` Folder. Your *Main* is called ``main.scss`` by default. All other SCSS files should be stored in ``${ASSETS_PATH}/${SCSS_PATH}/modules`` folder.

Valisette sets a couple of things by convention to keep a clean [SoC](https://en.wikipedia.org/wiki/Separation_of_concerns) :
* Your *Main* does not contain CSS code only imports
* All your variables are stored in ``${ASSETS_PATH}/${SCSS_PATH}/modules/_variables.scss`` 
* All your global styles are stored in ``${ASSETS_PATH}/${SCSS_PATH}/modules/_global.scss`` 
* Each *Layout* has its own scss file in ``${ASSETS_PATH}/${SCSS_PATH}/modules/_<layoutName>.scss`` 
* Each *Layout* File should be scoped by a tag to avoid conflicts
* Always follow a naming convention like [BEM](http://getbem.com/introduction/) or [Atomic](https://acss.io/)

## SPA Template File

The SPA Template is located in ``${ASSETS_PATH}/`` Folder, by default it's called ``index.ejs`` otherwise it's named after ``HTML_TEMPLATE``.
If you need to use an index.html and/or want to generate one : 
* turn on ``GENERATE_HTML`` to ``true``.
* run ``yarn run generate``.

## Static HTML File

You can put Static HTML files anywhere inside ``${PUBLIC_PATH}``. If you need to use an index.html and/or want to generate one : 
* turn off ``GENERATE_HTML`` to ``false``.
* run ``yarn run generate``.

## Images

Images Files are located in ``${ASSETS_PATH}/${IMAGES_PATH}`` Folder.

You can store assets any way you like but using ``imgmin`` command will export compressed images to ``${PUBLIC_PATH}/${IMAGES_PATH}`` and flatten the directory structure to fasten file access in production.

## Fonts

Images Files are located in ``${ASSETS_PATH}/${FONTS}`` Folder. By default, there are none copied over your file system.