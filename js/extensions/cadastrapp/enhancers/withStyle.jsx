import React from 'react';

/**
 * Adds the style passed as string in a style tag near the component
 * This workarounds limitation of extensions to load one single bundle
 * and allow to use a separated file for css, using it in couple with `raw-loader`.
 * @param {string} style the style to set inline
 * @example
 * import css from 'raw-loader!../cadastrapp.css.txt'; // the extension must NOT be .css
 * withStyle(css)(Component); // this enhances the component with the style
 *
 */
const withStyle = (style) => (Component) =>
    (props) => {
        return <>
            <style>{style}</style>
            <Component {...props} />
        </>;
    };
export default withStyle;
