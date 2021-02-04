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
import RequestObjectItem from '../RequestObjectItem';

describe('RequestObjectItem', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test render RequestObjectItem component', () => {
        ReactDOM.render(<RequestObjectItem/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
    });

    it('test render RequestObjectItem on actions', () => {
        const actions = {
            onDelete: () => {},
            setRequestFormData: () => {}
        };
        const spyHandleDelete = expect.spyOn(actions, 'onDelete');
        const spySetRequestFormData = expect.spyOn(actions, 'setRequestFormData');
        ReactDOM.render(<RequestObjectItem {...actions} value={"owner-id"} dataId={1} requestFormData={{comptecommunaux: {1: "Test"}}}/>, document.getElementById("container"));
        const container = document.getElementById('container');
        expect(container).toBeTruthy();
        const select = document.querySelector('.Select-control');
        expect(select).toBeTruthy();
        const selectInput = document.querySelector('[role="combobox"]');
        expect(selectInput).toBeTruthy();
        TestUtils.Simulate.change(selectInput, {target: {value: 'owner-id'}});
        expect(selectInput.value).toBe('owner-id');

        const delButton = document.querySelector('button');
        expect(delButton).toBeTruthy();
        TestUtils.Simulate.click(delButton);

        expect(spyHandleDelete).toHaveBeenCalled();
        expect(spyHandleDelete.calls[0].arguments[0]).toBe(1);

        expect(spySetRequestFormData).toHaveBeenCalled();
        expect(spySetRequestFormData.calls[0].arguments[0]).toEqual({"comptecommunaux": {}}); // Deleted

        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        expect(checkboxes.length).toBe(2);
    });
});
