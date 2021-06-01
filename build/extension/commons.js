const path = require("path");
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const DefinePlugin = require("webpack/lib/DefinePlugin");

const gitRevisionPlugin = new DefinePlugin({
    '__COMMITHASH__': JSON.stringify(new GitRevisionPlugin({
        commithashCommand: 'rev-parse HEAD'
    }).commithash()),
    '__REPOURL__': JSON.stringify(new GitRevisionPlugin({
        branchCommand: 'remote get-url origin'
    }).branch())
});

// common configuration between production and development for webpack
module.exports = {
    // exposes tells the module federation the entries to expose. `./plugin` the plugin key for loading.
    exposes: {
        "./plugin": path.join(__dirname, '..', '..', 'js', 'extension', 'plugins', "Extension")
    },
    // dist of the root of the project
    destination: path.join(__dirname, '..', '..', "dist"),
    // to compile properly also mapstore dependencies
    alias: {
        "@mapstore": path.resolve(__dirname, '..', '..', "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, '..', '..', "js")
    },
    gitRevisionPlugin
};
