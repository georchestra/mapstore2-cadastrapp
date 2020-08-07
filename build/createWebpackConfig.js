const path = require("path");

const themeEntries = require('../mapstore2-georchestra/themes.js').themeEntries;
const extractThemesPlugin = require('../MapStore2/build/themes.js').extractThemesPlugin;
// const NormalModuleReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");
const CopyPlugin = require('copy-webpack-plugin');
var ZipPlugin = require('zip-webpack-plugin');

const buildConfig = require('../MapStore2/build/buildConfig');
const proxyConfig = require('../proxyConfig');
const georchestraFramework = path.join(__dirname, "..", 'mapstore2-georchestra', "js");

/**
 *
 * @param {boolean} [cfg.prod=false] true if want production build
 * @param {object} [cfg.proxyConfig] configuration of the proxy server.
 */
const createWebpackConfig = ({prod = false} = {}) => {
    const configuration = buildConfig(
        {
            'cadastrapp-test-app': path.join(__dirname, "..", "js", "app")
        },
        themeEntries,
        {
            base: __dirname,
            dist: path.join(__dirname, "..", "dist"),
            framework: path.join(__dirname, "..", "MapStore2", "web", "client"),
            code: path.join(__dirname, "..", "js")
        },
        extractThemesPlugin,
        prod,
        "dist/",
        ".GeOrchestra",
        [
            new CopyPlugin( [
                    { from: path.resolve(__dirname, "..", 'translations'), to: 'translations'},
                    { from: path.resolve(__dirname, "..", 'assets', 'index.json'), to: 'index.json'}
                ])
            ,
            new ZipPlugin({
                filename: 'cadastrapp.zip',
                include: [
                    "extensions/cadastrapp.js",
                    /translations\/.*\.json/,
                    "index.json"
                ],
                pathMapper: assetPath => {
                    if(assetPath.startsWith('translations')) {
                        return assetPath;
                    }
                    // other files have to be placed in the root, with the same name
                    return path.basename(assetPath);
                }
            })
        ],
        {
            // this should prevent to load MapStore from sub-module of GeOrchestra, replacing it with the sub-module of
            "@mapstore": path.resolve(__dirname, "..", "MapStore2", "web", "client"),
            // this alias is reserved to GeOrchestra, should not be used in the application
            "@js": georchestraFramework,
            // next libs are added because of this issue https://github.com/geosolutions-it/MapStore2/issues/4569
            jsonix: "@boundlessgeo/jsonix",
            proj4: "@geosolutions/proj4",
            "react-joyride": "@geosolutions/react-joyride"
        },
        proxyConfig
    );
    // add to the babel loader the directory for mapstore2-georchestra
    configuration.module.rules = configuration.module.rules.map(rule => {
        const isBabelLoader = rule && rule.use && rule.use[0] && rule.use[0].loader === 'babel-loader'
        if (isBabelLoader) {
            return {
                ...rule,
                include: [...rule.include, georchestraFramework]
            }
        };
        return rule;
    });
    // set up chunk name
    configuration.output = {
        path: path.join(__dirname, "..", "dist"),
            publicPath: "/dist/",
                filename: "[name].js",
                    chunkFilename: "[name].js"
    }
    return configuration;
};
module.exports = createWebpackConfig;