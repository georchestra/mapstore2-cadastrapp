/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {applyTestEnv} from '../../../__tests__/testUtils';
import { zoomToExtentAllResults } from "@js/extension/actions/cadastrapp";
import ZoomTo from '../ZoomTo';

describe("ZoomTo", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('test render ZoomTo', () => {
        const [, Cmp] = applyTestEnv(ZoomTo, {reducers: {}, actions: []});
        ReactDOM.render(<Cmp />, document.getElementById('container'));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const zoomButton = document.querySelector('.glyphicon-resize-full');
        expect(zoomButton).toBeTruthy();
    });
    it('test zoom to all results or plot selections', () => {
        const [store, Cmp] = applyTestEnv(ZoomTo, { reducers: {}, actions: [zoomToExtentAllResults]});
        const spyOnZoomToResults = expect.spyOn(store, "dispatch");
        ReactDOM.render(<Cmp />, document.getElementById('container'));
        const zoomButton = document.querySelector('button');
        expect(zoomButton).toBeTruthy();
        ReactTestUtils.Simulate.click(zoomButton);
        expect(spyOnZoomToResults).toHaveBeenCalled();
        expect(spyOnZoomToResults.calls[0].arguments[0].type).toEqual('CADASTRAPP:ZOOM_TO_RESULTS');
    });
});
