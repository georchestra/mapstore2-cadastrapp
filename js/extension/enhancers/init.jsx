import React, { useEffect } from 'react';

export default () => (Component) => ({ setUp = () => { }, tearDown = () => { }, openOnLoad, open, ...props }) => {
    // auto open effect
    useEffect(() => {
        let timeout;
        let executed = false;
        if (openOnLoad) {
            timeout = setTimeout(() => {
                executed = true;
                open();
            }, 1500); // need to initialize first
        }
        return () => {
            // clean up auto-open results
            if (timeout && !executed) { // prevent execution
                clearTimeout(timeout);
            } else if (executed) {
                props?.onClose?.(); // force clear (resets possible issues due to map layout changes by cadastrapp)
            }
        };
    }, [openOnLoad]);
    // configuration load and initial setup
    useEffect(() => {
        if (props.enabled) {
            setUp(props?.pluginCfg);
        }
        return () => tearDown();
    }, [props.enabled]);
    return <Component {...props} />;
};
