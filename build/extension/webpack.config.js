
const createExtensionWebpackConfig = require('../../MapStore2/build/createExtensionWebpackConfig');

const { name } = require('../../config');
const { gitRevisionPlugin, ...commons } = require('./commons');
const webpackConfig = createExtensionWebpackConfig({
    prod: false,
    name,
    ...commons,
    overrides: {
        // serve translations (and index.json)
        devServer: {
            publicPath: "/extension/",
            contentBase: './assets',
            contentBasePublicPath: '/extension/'
        }
    },
    plugins: [ gitRevisionPlugin ]
});
// Temp fix to not fail for svg imports. TODO: wait for a fix on mapstore
const fileLoader = {
    test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: "[name].[ext]"
        }
    }]
};
const { module: moduleObj, ...extensionConfig } = webpackConfig;
const rules = moduleObj.rules;

module.exports = { ...extensionConfig, module: { ...moduleObj, rules: [...rules, fileLoader] } };
