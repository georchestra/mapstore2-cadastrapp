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
import PopupViewer from '../PopupViewer';
import cadastrapp from '../../../reducers/cadastrapp';
import {applyTestEnv} from "@js/extension/plugins/__tests__/testUtils";

describe('PopupViewer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test render PopupViewer component', () => {
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {}, actions: []});
        ReactDOM.render(<Cmp/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
    });

    it('test render PopupViewer with loader', () => {
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {}, actions: []});
        ReactDOM.render(<Cmp loader/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const loader = document.querySelector('.loader-container');
        expect(loader).toBeTruthy();
    });

    it('test render PopupViewer with empty info', () => {
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {}, actions: []});
        ReactDOM.render(<Cmp infoBulle={{test: "Suren"}} authLevel={{isCNIL1: true, isCNIL2: true}}/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        // const popup = document.querySelectorAll('.popup-container');
        // console.log("popup", popup);
        // expect(popup).toBeTruthy();
        // expect(popup.innerText).toBe('');
    });
});
