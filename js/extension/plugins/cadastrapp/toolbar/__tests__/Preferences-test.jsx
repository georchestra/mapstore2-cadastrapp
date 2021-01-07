import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Preferences from '../Preferences';
import {applyTestEnv} from '../../../__tests__/testUtils';
import cadastrapp from '../../../../reducers/cadastrapp';
import { setLayerStyles } from '../../../../actions/cadastrapp';
import { getDefaultStyle } from '../../../../selectors/cadastrapp';





describe("Preferences", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('test it opens the window', () => {
        const [, Cmp] = applyTestEnv(Preferences, { reducers: {cadastrapp}});
        ReactDOM.render(<Cmp />, document.getElementById('container'));
        const button = document.getElementsByTagName('button')[0];
        expect(button).toExist();
        expect(document.getElementsByClassName('cadastrapp-preferences-modal').length).toEqual(0);
        ReactTestUtils.Simulate.click(button);
        expect(document.getElementsByClassName('cadastrapp-preferences-modal').length).toEqual(1);
    });
    it('set default styles', () => {
        const [store, Cmp] = applyTestEnv(Preferences, { reducers: { cadastrapp } });
        ReactDOM.render(<Cmp />, document.getElementById('container'));
        const button = document.getElementsByTagName('button')[0];
        expect(button).toExist();
        expect(document.getElementsByClassName('cadastrapp-preferences-modal').length).toEqual(0);
        ReactTestUtils.Simulate.click(button);
        const setDefaultStyleButton = document.getElementsByTagName('button')[2]; // set default style button
        ReactTestUtils.Simulate.click(setDefaultStyleButton);
        expect(store.getActions()[0]).toEqual(setLayerStyles());
    });
});
