# MapStore2 plugin for Cadastrapp

This repository hosts the code for the front client of [Cadastrapp](https://github.com/georchestra/) in the [MapStore2 geOrchestra project](https://github.com/georchestra/mapstore2-georchestra).

## Documentation

See http://docs.georchestra.org/cadastrapp/guide_administrateur/

## Setup

Clone this repository with the `--recursive` option, because it uses some git sub-modules:

- `git clone --recursive https://github.com/georchestra/mapstore2-cadastrapp`

Download dependencies:

- `npm install`

## Build

`npm run compile` will create the extension zip file ready to install in `dist/cadastrapp.zip`.

## Development

**Requirements:**

- Back-end of MapStore instance of geoOrchestra running at `localhost:8080/mapstore` (edit `proxyConfig.js` to change it)
- To test admin permission, it needs to run behind the security proxy of geOrchestra

**Run in development mode:**

`npm start` will start the development server at `http://localhost:8081`. You can edit `proxyConfig.js` to edit the entry points for MapStore back-end (and cadastrapp) you want to access from this development instance.

## How to develop Cadastrapp Extension

The project here is a mock of geOrchestra, that tries to reuse most of geOrchestra as a sub-project to support the development of the `Cadastrapp` plugin.

### Javascript code

All the code of cadastrapp MapStore plugin have to be placed in the folder `js/extensions/cadastrapp`.
The folder is structured as a typical react-redux application, with `components` folder. You can develop the extension as a normal plugin of MapStore. Also configuration should be passed as

### Bundle files

When run `npm run compile` the mock application will build leaving a separated js file for the entry `cadastrapp.js`. This file, will be bundled in the final zip with:

- Translations Files: you can edit them in `translations` folder, these files will be included in the final zip package.

- `index.json` the file `assets/index.json` is the descriptor of the extension with informations and depe

All details about these files are available [here](https://github.com/geosolutions-it/MapStore2/wiki/%5BProposal%5D:-Extension-System#backend-support).
