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
import { LOADING, SET_CONFIGURATION, setUp, SETUP_COMPLETED, TOGGLE_SELECTION} from "@js/extension/actions/cadastrapp";
import {UPDATE_ADDITIONAL_LAYER, REMOVE_ADDITIONAL_LAYER} from "@mapstore/actions/additionallayers";
import {CLEAN_MAP_POPUPS} from "@mapstore/actions/mapPopups";
import {TOGGLE_MAPINFO_STATE, HIDE_MAPINFO_MARKER} from "@mapstore/actions/mapInfo";
import {REGISTER_EVENT_LISTENER, UNREGISTER_EVENT_LISTENER} from "@mapstore/actions/map";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
    CADASTRAPP_OWNER,
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID, CONTROL_NAME,
    MOUSE_EVENT
} from "@js/extension/constants";
import {UPDATE_DOCK_PANELS} from "@mapstore/actions/maplayout";
import {setControlProperty} from "@mapstore/actions/controls";

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
            9,
            setUp(),
            actions => {
                expect(actions.length).toBe(9);
                actions.map(action=>{
                    switch (action.type) {
                    case LOADING:
                        expect(action.name).toBe('configuration');
                        break;
                    case UPDATE_DOCK_PANELS:
                        expect(action.name).toBe(CONTROL_NAME);
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
                    case HIDE_MAPINFO_MARKER:
                        break;
                    case SETUP_COMPLETED:
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
            7,
            setControlProperty(CONTROL_NAME, 'enabled', false),
            actions => {
                expect(actions.length).toBe(7);
                actions.map(action=>{
                    switch (action.type) {
                    case TOGGLE_SELECTION:
                        break;
                    case REMOVE_ADDITIONAL_LAYER:
                        expect(includes([CADASTRAPP_VECTOR_LAYER_ID, CADASTRAPP_RASTER_LAYER_ID], action.id)).toBe(true);
                        expect(action.owner).toBe(CADASTRAPP_OWNER);
                        break;
                    case UPDATE_DOCK_PANELS:
                        expect(action.name).toBe(CONTROL_NAME);
                        expect(action.action).toBe('remove');
                        break;
                    case CLEAN_MAP_POPUPS:
                        break;
                    case TOGGLE_MAPINFO_STATE:
                        break;
                    case HIDE_MAPINFO_MARKER:
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
