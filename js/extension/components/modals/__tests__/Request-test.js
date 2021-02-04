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
import Request from '../Request';

/**
 * Simulate user select
 */
const simulateUserSelection = (field) => {
    TestUtils.act(() => {
        TestUtils.Simulate.focus(field);
        TestUtils.Simulate.keyDown(field, { key: 'ArrowDown', keyCode: 40 });
    });
    const selectArrow = document.querySelector('.Select-arrow');
    const selectControl = document.querySelector('.Select-control');
    TestUtils.Simulate.mouseDown(selectArrow, { button: 0 });
    TestUtils.Simulate.keyDown(selectControl, { keyCode: 40, key: 'ArrowDown' });
    TestUtils.Simulate.keyDown(field, { keyCode: 13, key: 'Enter' });
};

describe('Request', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test render Request component', () => {
        ReactDOM.render(<Request/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
    });

    it('test render Request all input fields', () => {
        ReactDOM.render(<Request isShown/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const fields = document.querySelectorAll('input');
        expect(fields.length).toBe(8);
        fields.forEach((f, i)=>
            i === 0
                ? expect(f.disabled).toBe(false)  // Request user type
                : expect(f.disabled).toBe(true)
        );
    });

    it('test enable field based on Request user type selection', () => {
        ReactDOM.render(<Request isShown/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        let fields = document.querySelectorAll('input');
        const requestUserType = fields[0];
        simulateUserSelection(requestUserType); // Simulate select
        fields = document.querySelectorAll('input');
        fields.forEach(f=> expect(f.disabled).toBe(false));
    });

    it('test enabled request by fields', () => {
        ReactDOM.render(<Request isShown/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        let fields = document.querySelectorAll('input');
        const requestUserType = fields[0];
        simulateUserSelection(requestUserType);
        fields = document.querySelectorAll('input');
        const lastName = fields[2];
        TestUtils.Simulate.change(lastName, {target: {value: "Test"}});
        const radioFields = document.querySelectorAll('input[type="radio"]');
        expect(radioFields).toBeTruthy();
        expect(radioFields.length).toBe(6);
        expect(radioFields[0].checked).toBe(true); // Request ask by
        expect(radioFields[3].checked).toBe(true); // Give document by
    });

    it('test enable request by fields and request object component', () => {
        ReactDOM.render(<Request isShown/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        let fields = document.querySelectorAll('input');
        const requestUserType = fields[0];
        simulateUserSelection(requestUserType);
        fields = document.querySelectorAll('input');
        const lastName = fields[2];
        TestUtils.Simulate.change(lastName, {target: {value: "Test"}});
        const radioFields = document.querySelectorAll('input[type="radio"]');
        expect(radioFields).toBeTruthy();
        expect(radioFields.length).toBe(6);
        expect(radioFields[0].checked).toBe(true); // Request ask by
        expect(radioFields[3].checked).toBe(true); // Give document by

        const addIcon = document.querySelectorAll('.glyphicon-plus');
        expect(addIcon).toBeTruthy();
    });

    it('test render Request footer component', () => {
        ReactDOM.render(<Request isShown />, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        let fields = document.querySelectorAll('input');
        const requestUserType = fields[0];
        simulateUserSelection(requestUserType);
        fields = document.querySelectorAll('input');
        const lastName = fields[2];
        TestUtils.Simulate.change(lastName, {target: {value: "Test"}});

        const buttons = document.querySelectorAll('button.print');
        expect(buttons).toBeTruthy();
        expect(buttons.length).toBe(2);
        buttons.forEach(b=> expect(b.disabled).toBeTruthy());
    });
});
