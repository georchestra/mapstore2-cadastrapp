// webpack configuration for production
const createWebpackConfig = require('./build/createWebpackConfig');
module.exports = createWebpackConfig({prod: true});