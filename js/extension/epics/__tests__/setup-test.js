/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from "expect";
import includes from 'lodash/includes';
import { testEpic } from "@mapstore/epics/__tests__/epicTestUtils";
import {cadastrappSetup, cadastrappTearDown} from "@js/extension/epics/cadastrapp";
import {LOADING, SET_CONFIGURATION, setUp, TOGGLE_SELECTION, tearDown} from "@js/extension/actions/cadastrapp";
import {UPDATE_ADDITIONAL_LAYER, REMOVE_ADDITIONAL_LAYER} from "@mapstore/actions/additionallayers";
import {CLEAN_MAP_POPUPS} from "@mapstore/actions/mapPopups";
import {TOGGLE_MAPINFO_STATE} from "@mapstore/actions/mapInfo";
import {REGISTER_EVENT_LISTENER, UNREGISTER_EVENT_LISTENER} from "@mapstore/actions/map";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
    CADASTRAPP_OWNER,
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID, CONTROL_NAME,
    MOUSE_EVENT
} from "@js/extension/constants";

describe("setup Epics", () => {
    let mockAxios;
    beforeEach(done => {
        mockAxios = new MockAdapter(axios);
        setTimeout(done);
    });

    afterEach(done => {
        mockAxios.restore();
        setTimeout(done);
    });
    it("cadastrappSetup Epic", done => {
        const state = {
            mapInfo: {enabled: true},
            cadastrapp: {configuration: {cadastreWMSLayerName: "layername", cadastreWMSURL: 'wms url', cadastreWFSURL: "wfs url"}}
        };
        mockAxios.onGet().reply(200);
        testEpic(
            cadastrappSetup,
            7,
            setUp(),
            actions => {
                expect(actions.length).toBe(7);
                actions.map(action=>{
                    switch (action.type) {
                    case LOADING:
                        expect(action.name).toBe('configuration');
                        break;
                    case SET_CONFIGURATION:
                        break;
                    case UPDATE_ADDITIONAL_LAYER:
                        expect(includes([CADASTRAPP_VECTOR_LAYER_ID, CADASTRAPP_RASTER_LAYER_ID], action.id)).toBe(true);
                        expect(action.owner).toBe(CADASTRAPP_OWNER);
                        expect(action.actionType).toBe('overlay');
                        expect(action.options).toBeTruthy();
                        break;
                    case REGISTER_EVENT_LISTENER:
                        expect(action.eventName).toBe(MOUSE_EVENT);
                        expect(action.toolName).toBe(CONTROL_NAME);
                        break;
                    case TOGGLE_MAPINFO_STATE:
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

    it("cadastrappTearDown Epic", done => {
        const state = {
            mapInfo: {enabled: false},
            cadastrapp: {configuration: {cadastreWMSLayerName: "layername", cadastreWMSURL: 'wms url', cadastreWFSURL: "wfs url"}}
        };
        testEpic(
            cadastrappTearDown,
            5,
            tearDown(),
            actions => {
                expect(actions.length).toBe(5);
                actions.map(action=>{
                    switch (action.type) {
                    case TOGGLE_SELECTION:
                        break;
                    case REMOVE_ADDITIONAL_LAYER:
                        expect(includes([CADASTRAPP_VECTOR_LAYER_ID, CADASTRAPP_RASTER_LAYER_ID], action.id)).toBe(true);
                        expect(action.owner).toBe(CADASTRAPP_OWNER);
                        break;
                    case CLEAN_MAP_POPUPS:
                        break;
                    case TOGGLE_MAPINFO_STATE:
                        break;
                    case UNREGISTER_EVENT_LISTENER:
                        expect(action.eventName).toBe(MOUSE_EVENT);
                        expect(action.toolName).toBe(CONTROL_NAME);
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
