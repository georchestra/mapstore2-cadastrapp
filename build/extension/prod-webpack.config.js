
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const createExtensionWebpackConfig = require('../../MapStore2/build/createExtensionWebpackConfig');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const {name} = require('../../config');
const { gitRevisionPlugin, plugins: commonsPlugins, ...commons} = require('./commons');

// the build configuration for production allow to create the final zip file, compressed accordingly
const plugins = [
    new CopyPlugin([
        { from: path.resolve(__dirname, "..", "..", "assets", "translations"), to: "translations" },
        { from: path.resolve(__dirname, "..", "..", "assets", "index.json"), to: "index.json" }
    ]),
    new ZipPlugin({
        filename: `${name}.zip`,
        pathMapper: assetPath => {
            if (assetPath.startsWith('translations') || assetPath.startsWith('assets')) {
                return assetPath;
            }
            // other files have to be placed in the root, with the same name
            return path.basename(assetPath);
        }
    }),
    gitRevisionPlugin,
    ...commonsPlugins
];
// Temp fix to not fail for svg imports. TODO: wait for a fix on mapstore createExtensionWebpackConfig
const fileLoader = {
    test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: "[name].[ext]"
        }
    }]
};
const urlLoader = {
    test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
    use: [{
        loader: 'url-loader',
        options: {
            mimetype: "application/font-woff"
        }
    }]
};
const {module: moduleObj, ...extensionConfig} = createExtensionWebpackConfig({ prod: true, name, ...commons, plugins});
// Temp fix to return errors for leaflet
// TODO: wait for a fix on mapstore createExtensionWebpackConfig
const rules = [{
    ...moduleObj.rules[0], // css rule is the first
    use: [{
        loader: MiniCssExtractPlugin.loader, // replace prod loader first 'use' entry, adding the publicPath.
        options: {
            publicPath: '' // leaflet rises an error about public path, if missing.
        }
    }, ...moduleObj.rules[0].use.slice(1)]
}, ...moduleObj.rules.slice(1)];

module.exports = { ...extensionConfig, module: { ...moduleObj, rules: [...rules, fileLoader, urlLoader] } };
