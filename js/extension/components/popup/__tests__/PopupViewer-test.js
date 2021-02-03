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
import {loading, saveBubbleInfo} from "@js/extension/actions/cadastrapp";

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
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {cadastrapp}, actions: [saveBubbleInfo({}), loading(false, 'popupLoading')]});
        ReactDOM.render(<Cmp/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const popup = document.querySelector('.popup-container');
        expect(popup).toBeTruthy();
        expect(popup.innerText).toBe('cadastrapp.popup.nodata');
    });

    it('test render PopupViewer with bulle info', () => {
        const infoBulle = {
            parcelle: '350238000BE0217',
            cgocommune: '350238',
            dnupla: '217',
            ccopre: '',
            ccosec: 'BE',
            surfc: 2831,
            libcom: 'RENNES',
            dcntpa: 2813,
            dnvoiri: '1',
            dindic: ' ',
            cconvo: 'RUE',
            dvoilib: 'DE LA BORDERIE'
        };
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {cadastrapp}, actions: [saveBubbleInfo(infoBulle), loading(false, 'popupLoading')]});
        ReactDOM.render(<Cmp/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const popup = document.querySelector('.popup-container');
        expect(popup).toBeTruthy();
        const label = document.querySelectorAll('td.info-popup-label');
        expect(label.length).toBe(9); // Owner info not displayed
        const labelValue = document.querySelectorAll('td.info-popup-value');
        expect(labelValue.length).toBe(9);
        const expResults = ['RENNES', '35', '238', '', 'BE', '217', '1   RUE DE LA BORDERIE', '2,813 m²', '2,831 m²'];
        labelValue.forEach((value, i) => expect(value.textContent.trim()).toBe(expResults[i]));
    });
    it('test render PopupViewer with owner bulle info', () => {
        const infoBulle = {
            parcelle: '350238000BE0217',
            proprietaires: [{app_nom_usage: "LES COPROPRIETAIRES"}]
        };
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {cadastrapp}, actions: [saveBubbleInfo(infoBulle), loading(false, 'popupLoading')]});
        ReactDOM.render(<Cmp/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const label = document.querySelectorAll('td.info-popup-label');
        expect(label.length).toBe(10); // Owner info displayed
        const labelValue = document.querySelectorAll('td.info-popup-value');
        expect(labelValue.length).toBe(10);
        expect(labelValue[9].textContent.trim()).toBe('LES COPROPRIETAIRES');
    });

    it('test render PopupViewer with land bulle info', () => {
        const infoBulle = {
            parcelle: '350238000BE0217',
            comptecommunal: '350238+02542',
            dcntpa_sum: 8133,
            sigcal_sum: 8145
        };
        const [, Cmp] = applyTestEnv(PopupViewer, {reducers: {cadastrapp}, actions: [saveBubbleInfo(infoBulle), loading(false, 'popupLoading')]});
        ReactDOM.render(<Cmp/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const label = document.querySelectorAll('td.info-popup-label');
        expect(label.length).toBe(12); // Owner info displayed
        const labelValue = document.querySelectorAll('td.info-popup-value');
        expect(labelValue.length).toBe(12);
        expect(labelValue[9].textContent.trim()).toBe('350238+02542'); // Municipal account
        expect(labelValue[10].textContent.trim()).toBe('8133 m²'); // DGFiP UP
        expect(labelValue[11].textContent.trim()).toBe('8145 m²'); // GIS UP
    });
});
