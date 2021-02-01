/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useEffect } from 'react';
import MapView from '@mapstore/components/widgets/widget/MapView';

// This prevents issues due to util lib that checks for process.env.NODE_DEBUG and make the openlayers map load fail
// TODO: set it up in build
const fakeProcess = (Component) => {
    return (props) => {
        useEffect(() => {
            if (!window.process) {
                window.process = { env: {} };
            } else if (!window.process.env) {
                window.process.env = {};
            }
        }, []);
        return <Component {...props} />;

    };
};
export default fakeProcess(MapView);

