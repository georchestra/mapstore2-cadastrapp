# General

This repository is a [MapStore Extensions](https://mapstore.readthedocs.io/en/latest/developer-guide/extensions/) repository to build cadastrapp
It is based on https://github.com/geosolutions-it/MapStoreExtension with the customizations for geOrchestra, and it follows the same conventions.

It can be used also as a starting template to create new extensions for geOrchestra.

## Quick Start

Clone the repository with the --recursive option to automatically clone submodules.

`git clone --recursive https://github.com/georchestra/mapstore2-cadastrapp`

Install NodeJS >= 12.16.1 , if needed, from [here](https://nodejs.org/en/download/releases/).

You can start the development application locally:

`npm install`

`npm start`

The application runs at `http://localhost:8081` afterwards. You will see, opening a map, the sample plugin on top of the map.

### Running geOrchestra

You can run this application and refer with the dev proxy all the entry points you expect from geOrchestra.
If you need to login, you can run geOrchestra locally and use the header extension to fake login. When you will try to login from the login menu,
you will be logged in as the user indicated in the headers. See geOrchestra development guide for details.

### Build Extension

To build the extension you should run

- `npm run ext:build`

This will create a zip with the name of your extension in `dist` directory.


### Test Module

The current project contains the plugin on its own. In a production environment the extension will be loaded dynamically from the MapStore back-end.
You can simulate in dev-mode this condition by:

Commenting `js/app.js` the lines indicated in `js/app.jsx`, that allow to load the plugin in the main app.

```javascript
// Import plugin directly in application. Comment the 3 lines below to test the extension live.
const extensions = require('./extensions').default;
plugins.plugins = { ...plugins.plugins, ...extensions };
ConfigUtils.setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './assets/translations']);
// end of lines to comment
```

- run, in 2 different console the following commands:
  - `npm run ext:start`
  - `npm run ext:startapp`

This will run webpack dev server on port 8081 with MapStore, simulating the `extensions.json`, and will run on port 8082 the effective modules to load.

## Dev Hints

Here a list of hints to develop your extension:

- In order to keep your changes as much self contained as possible we suggest to put all your code (and assets) in `js/extension/`. (Put css in `js/extension/assets/`, etc...)
- Use the `@mapstore` alias to refer to MapStore components. This helps your code to be compatible with future enhancements when mapstore will be published as a separated package, that can be shared
