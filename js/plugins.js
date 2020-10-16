import georchestra from '../mapstore2-georchestra/js/plugins';
const { plugins: gsPlugins, ...rest } = georchestra;
import extensions from './extensions';
export default {
    plugins: {
        ...gsPlugins,
        ...extensions
    },
    ...rest
};
