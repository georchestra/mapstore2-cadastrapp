# General

This repository is a [MapStore Extensions](https://mapstore.readthedocs.io/en/latest/developer-guide/extensions/) repository to build cadastrapp.
It is based on https://github.com/geosolutions-it/MapStoreExtension with the customizations for geOrchestra, and it follows the same conventions.

It can be used also as a template to create new extensions for geOrchestra.

## Plugin configuration

The extension can be installed using the context manager UI.
Once the extension is installed, it can be added also to the default context by editing `localConfig.json` as usual, or added to a specific context, using the context editor user interface.

### Local config

The plugin allows configuration of the following properties:

- *helpUrl* - Plugin specific help url for more details on the extension, used by the help button
- *openOnLoad* - Auto open plugin the plugin on load
- *foncier* - activate/deactivate `foncier` functionalities
- *popup* - settings for popup
- *styles* - styles for `Preferences`

example:

 ```json
 {
 "cfg": {
    "helpUrl": "https://docs.georchestra.org/cadastrapp/",
    "openOnLoad": false,
    "foncier": true,
    "popup": {
      "minZoom": 14,
      "timeToShow": 1000
    },
    "styles": {
      "selected": {
        "fillColor": "#81BEF7",
        "opacity": 0.6,
        "fillOpacity": 0.6,
        "color": "#111111",
        "weight": 4
      },
      "default": {
        "fillColor": "#222111",
        "opacity": 0.4,
        "fillOpacity": 0.4,
        "color": "#111222",
        "weight": 2
      }
    }
  }
 }
 ```

## Quick Start

Clone the repository with the --recursive option to automatically clone submodules.

`git clone --recursive https://github.com/georchestra/mapstore2-cadastrapp`

Install NodeJS >= 12.16.1 , if needed, from [here](https://nodejs.org/en/download/releases/).

You can start the development application locally:

`npm install`

`npm start`

The application runs at `http://localhost:8081` afterwards. You will see, opening a map, the sample plugin on top of the map.

### Running geOrchestra

#### Backend Dev Setup

You can run this application and refer to a running back-end of geOrchestra by configuring `proxyConfig.js` in the root of the project.
You can configure this to point to your running instance of geOrchestra, with cadastrapp installed.

When pointing directly at cadastrapp short-circuiting geOrchestra's sec-proxy,
one can be properly authenticated by faking the extra headers via `proxyConfig.js`:

```javascript
    "/rest": {
        target: `http://localhost:8180/mapstore`,
        secure: false,
        headers: {
            "sec-roles": "ROLE_CADASTRAPP;ROLE_MAPSTORE_ADMIN",
            "sec-username": 'testadmin',
            "sec-org": 'PSC',
            host: `georchestra.example.org`
        }
    },
    ...
    "/cadastrapp": {
        target: `http://localhost:8180`,
        secure: false,
        headers: {
           "sec-roles": "ROLE_CADASTRAPP",
           "sec-username": 'testadmin',
           "sec-org": 'PSC',
           host: `georchestra.example.org`
        }
    }
```

in that case, that assumes that `npm start` runs on the same machine where
cadastrapp & mapstore backends runs, and that the corresponding tomcat listens
on port 8180. This should be adapted if using different ports, or being
deployed on a different machine.

With that setup and the default `localConfig.json` (which uses a login button),
simulating a login (eg login with random credentials) will call
`http://localhost:8081/rest/geostore/users/user/details?includeattributes=true`
(which behind the scenes will call the existing mapstore backend, adding the
appropriate headers) and from that point the frontend will consider the
current user logged in with full rights on cadastrapp backend.

#### Proxy

If you will try to do requests to absolute URLs, you may be redirected to use the proxy. (the request will be transformed in something like `/mapstore/proxy?url=...`).
Make sure that this entry point(s) (configured in `proxyConfig.json`) are able to resolve the URL passed as parameter.
If supported, you can add the URL to `useCors` entry in `localConfig.json` (see mapstore documentation).

#### Authentication

If you need to login, you can run geOrchestra locally and use the header extension to fake the login (see [Dev documentation of GeOrchestra](https://docs.georchestra.geo-solutions.it/en/latest/developer/index.html#mocking-security)). When you will try to login from the login menu, you will be logged in as the user indicated in the headers.

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

## Developing your own extension starting from this repo

This is basically a repository for a MapStore Extension. All the code of the extension is under `js/extension` directory. You can replace the `plugins/Extension.js` with your own file. and configure the project to develop your own application.
See [the dedicated section of the Readme of MapStore Extension for details](https://github.com/geosolutions-it/MapStoreExtension/blob/master/README.md#start-creating-your-own-extension)

## Release

In ordrer to do a release you can use the following steps. Usually it is done on master so you can simply

- Build the extension locally, or download the last artifact from the github actions (they disappear after N days) 
- Create a github release ( From github repo page --> `Releases` --> `Draft a new release`)
    - target the master branch, if you have to publish from master 
    - Write the tag name you want for the release and click on "Create new tag [...] on publish" entry. (This will create a new tag on the HEAD of the master branch when the release is published). E.g. `1.0.0-rc21`
    - Fill title of the release with the name of the release (usually the same of the tag)
    - Fill the release description ("auto-generate release notes" button usually does the job)
    - Upload the extension zip to the attachments for the release
    - Publish the release (this will create the tag)
