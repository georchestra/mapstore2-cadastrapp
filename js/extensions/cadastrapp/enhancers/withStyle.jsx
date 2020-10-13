import React from 'react';

/**
 * Adds a style tag with the CSS inline.
 * @param {string} style the style to set inline
 */
const withStyle = (style) => (Component) =>
    (props) => {
        return <>
            <style>{style}</style>
            <Component {...props} />
        </>;
    };
export default withStyle;
