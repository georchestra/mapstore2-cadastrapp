/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from "expect";
import { testEpic } from "@mapstore/epics/__tests__/epicTestUtils";
import MockAdapter from 'axios-mock-adapter';
import axios from '@mapstore/libs/ajax';
import { saveInformationRequestEpic } from "@mapstore/ext/cadastrapp/epics/cadastrapp";
import {LOADING, onPrintPDF, PRINT_RESPONSE} from "@mapstore/ext/cadastrapp/actions/cadastrapp";

describe("saveInformationRequest Epics", () => {
    let mockAxios;
    beforeEach(done => {
        mockAxios = new MockAdapter(axios);
        setTimeout(done);
    });

    afterEach(done => {
        mockAxios.restore();
        setTimeout(done);
    });
    it("saveInformationRequest Epic of type print ", done => {
        const state = {};
        const buffer = new ArrayBuffer(8);
        const printParams = "cni=12345&type=A&firstname=Test";
        mockAxios.onGet(`/cadastrapp/services/saveInformationRequest?${printParams}`).reply(200, {id: 10});
        mockAxios.onGet('/cadastrapp/services/printPDFRequest').reply(200, buffer, {});
        testEpic(
            saveInformationRequestEpic,
            3,
            onPrintPDF(printParams),
            actions => {
                expect(actions.length).toBe(3);
                actions.map(action=>{
                    switch (action.type) {
                    case LOADING:
                        expect(action.name).toBe('printing');
                        break;
                    case PRINT_RESPONSE:
                        expect(action.allowDocument).toBe(true);
                        expect(action.requestId).toBe(10);
                        break;
                    default:
                        expect(false).toBe(true);
                    }
                });
                done();
            },
            state
        );
    });

    it("saveInformationRequest Epic of type document", done => {
        const state = {cadastrapp: {requestFormData: {requestId: 20}}};
        const buffer = new ArrayBuffer(8);
        mockAxios.onGet().reply(200, buffer, {});
        testEpic(
            saveInformationRequestEpic,
            3,
            onPrintPDF(null, "document"),
            actions => {
                expect(actions.length).toBe(3);
                actions.map(action=>{
                    switch (action.type) {
                    case LOADING:
                        expect(action.name).toBe('printing');
                        break;
                    case PRINT_RESPONSE:
                        expect(action.allowDocument).toBe(false);
                        expect(action.requestId).toBe(null);
                        break;
                    default:
                        expect(false).toBe(true);
                    }
                });
                done();
            },
            state
        );
    });
});
