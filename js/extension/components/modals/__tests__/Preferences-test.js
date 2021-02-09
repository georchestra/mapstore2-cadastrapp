/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import expect from 'expect';
import ReactDOM from "react-dom";
import TestUtils from 'react-dom/test-utils';
import Preferences from '../Preferences';
import {LAYER_STYLES} from "@js/extension/constants";

describe('Preferences', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test render Preferences component', () => {
        ReactDOM.render(<Preferences/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
    });

    it('test Preferences render tabs', () => {
        ReactDOM.render(<Preferences isShown styles={LAYER_STYLES}/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const tabs = document.querySelectorAll('[role="tab"]');
        expect(tabs.length).toBe(2);
    });

    it('test render Preferences on set styles', () => {
        const action = {
            setLayerStyles: () => {}
        };
        const spySetLayerStyles = expect.spyOn(action, "setLayerStyles");
        ReactDOM.render(<Preferences isShown styles={LAYER_STYLES} {...action}/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const button = document.querySelector('button');
        expect(button).toBeTruthy();
        TestUtils.Simulate.click(button);
        expect(spySetLayerStyles).toHaveBeenCalled();
        const argument = spySetLayerStyles.calls[0].arguments[0];
        expect(argument.selected).toBeTruthy();
        expect(argument.default).toBeTruthy();
    });
});
