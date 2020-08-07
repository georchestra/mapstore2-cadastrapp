const {plugins, ...rest} = require('../mapstore2-georchestra/js/plugins');
const extensions = require('./extensions');
module.exports = {
    plugins: {
        ...plugins,
        ...(extensions.default)
    },
    ...rest
};
