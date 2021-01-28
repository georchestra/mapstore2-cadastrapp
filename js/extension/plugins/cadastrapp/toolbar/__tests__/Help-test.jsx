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
import Help from '../Help';

describe("Help", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('test render Help', () => {
        ReactDOM.render(<Help />, document.getElementById('container'));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const zoomButton = document.querySelector('.glyphicon-question-sign');
        expect(zoomButton).toBeTruthy();
    });
    it('test trigger help link', () => {
        const helpUrl = "http://www.domain.com/documentation";
        const spyOnWindow = expect.spyOn(window, 'open');
        ReactDOM.render(<Help helpUrl={helpUrl} />, document.getElementById('container'));
        const zoomButton = document.querySelector('button');
        expect(zoomButton).toBeTruthy();
        ReactTestUtils.Simulate.click(zoomButton);
        expect(spyOnWindow).toHaveBeenCalled();
        expect(spyOnWindow.calls[0].arguments[0]).toEqual(helpUrl);
    });
});
