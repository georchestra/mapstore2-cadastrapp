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
import { Provider } from 'react-redux';
import ProprietaireComboList from '../ProprietaireComboList';
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import TestUtils from 'react-dom/test-utils';
import configureMockStore from "redux-mock-store";
const mockStore = configureMockStore();

describe('ProprietaireComboList', () => {
    let store;
    let mockAxios;
    beforeEach((done) => {
        store = mockStore();
        mockAxios = new MockAdapter(axios);
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        mockAxios.restore();
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test render ProprietaireComboList component', () => {
        store = mockStore({
            cadastrapp: {
                configuration: {
                    minNbCharForSearch: 2
                }
            }
        });
        ReactDOM.render(<Provider store={store}><ProprietaireComboList/></Provider>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
    });

    it('test value search from combobox', () => {
        store = mockStore({
            cadastrapp: {
                configuration: {
                    minNbCharForSearch: 2
                }
            }
        });
        mockAxios.onGet().reply(200, [{label: "test", value: "1"}]);
        ReactDOM.render(<Provider store={store}><ProprietaireComboList/></Provider>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const dropDown = document.querySelectorAll('[role="combobox"]');
        expect(dropDown.length).toBe(1);
        TestUtils.Simulate.change(dropDown[0], {target: {value: 'test'}});
        expect(dropDown[0].value).toBe('test');
    });
});
