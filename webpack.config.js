const path = require("path");

const themeEntries = require('./MapStore2/build/themes.js').themeEntries;
const extractThemesPlugin = require('./MapStore2/build/themes.js').extractThemesPlugin;
const ModuleFederationPlugin = require('./MapStore2/build/moduleFederation').plugin;
const DEV_PROTOCOL = "http";
const DEV_HOST = "localhost:8080";
const buildConfig = require('./MapStore2/build/buildConfig');
const cfg = buildConfig(
    {
        'MapStoreExtension': path.join(__dirname, "js", "app"),
        'MapStoreExtension-embedded': path.join(__dirname, "MapStore2", "web", "client", "product", "embedded"),
        'MapStoreExtension-api': path.join(__dirname, "MapStore2", "web", "client", "product", "api")
    },
    themeEntries,
    {
        base: __dirname,
        dist: path.join(__dirname, "dist"),
        framework: path.join(__dirname, "MapStore2", "web", "client"),
        code: [path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client")]
    },
    [extractThemesPlugin, ModuleFederationPlugin],
    false,
    "dist/",
    '.MapStoreExtension',
    [],
    {
        "@mapstore": path.resolve(__dirname, "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, "js")
    },
    {
        "/rest": {
            target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
            secure: false,
            headers: {
                host: `${DEV_HOST}`
            }
        },
        "/pdf": {
            target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
            secure: false,
            headers: {
                host: `${DEV_HOST}`
            }
        },
        "/mapstore/pdf": {
            target: `${DEV_PROTOCOL}://${DEV_HOST}`,
            secure: false,
            headers: {
                host: `${DEV_HOST}`
            }
        },
        "/proxy": {
            target: `https://dev.mapstore.geo-solutions.it/mapstore`,
            secure: false
        },
        "/geonetwork": {
            target: `${DEV_PROTOCOL}://${DEV_HOST}/geonetwork`,
            secure: false,
            headers: {
                host: `${DEV_HOST}`
            }
        },
        "/header": {
            target: `${DEV_PROTOCOL}://${DEV_HOST}`,
            secure: false,
            headers: {
                host: `${DEV_HOST}`
            }
        },
        "/cadastrapp": {
            target: `https://georchestra.geo-solutions.it`,
            secure: false,
            headers: {
                host: `georchestra.geo-solutions.it`
            }
        }
    }
);
// stream are needed here in code
cfg.resolve.fallback = {timers: false};
module.exports = cfg;
