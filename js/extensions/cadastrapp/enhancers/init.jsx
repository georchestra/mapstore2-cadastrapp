import React, { useEffect } from 'react';

export default () => (Component) => ({ setUp = () => { }, tearDown = () => { }, ...props }) => {
    useEffect(() => {
        if (props.enabled) {
            setUp();
        }
        return () => tearDown();
    }, [props.enabled]);
    return <Component {...props} />;
};
