
const createExtensionWebpackConfig = require('../../MapStore2/build/createExtensionWebpackConfig');

const { name } = require('../../config');
const commons = require('./commons');
const webpackConfig = createExtensionWebpackConfig({
    prod: false,
    publicPath: "/extension/",
    name,
    ...commons,
    overrides: {
        // serve translations (and index.json)
        devServer: {
            contentBase: './assets',
            contentBasePublicPath: '/extension/'
        }
    }
});

module.exports = webpackConfig;
