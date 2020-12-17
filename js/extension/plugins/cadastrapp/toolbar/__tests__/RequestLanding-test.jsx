import React from 'react';
import expect from 'expect';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import RequestLanding from '../RequestLanding';


describe("RequestLanding", () => {
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
        ReactDOM.render(<RequestLanding />, document.getElementById('container'));
        const button = document.getElementsByTagName('button')[0];
        expect(button).toExist();
        expect(document.getElementsByClassName('cadastrapp-modal').length).toEqual(0);
        ReactTestUtils.Simulate.click(button);
        expect(document.getElementsByClassName('cadastrapp-modal').length).toEqual(1);
    });
});
