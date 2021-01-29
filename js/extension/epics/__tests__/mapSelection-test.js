/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from "expect";
import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import { testEpic } from "@mapstore/epics/__tests__/epicTestUtils";
import {LAYER_STYLES} from "@js/extension/constants";
import {mouseMoveMapEventEpic, showPopupEpic} from "../cadastrapp";
import { mouseMove } from "@mapstore/actions/map";
import { ADD_MAP_POPUP } from "@mapstore/actions/mapPopups";
import {LOADING, SAVE_BUBBLE_INFO, SHOW_POPUP, showPopup} from "@js/extension/actions/cadastrapp";

describe("layerSync Epics", () => {
    const state = {
        additionallayers: [
            {
                id: '__CADASTRAPP_VECTOR_LAYER__',
                owner: 'CADASTRAPP',
                actionType: 'overlay',
                options: {
                    id: '__CADASTRAPP_VECTOR_LAYER__',
                    type: 'wms',
                    name: 'qgis:cadastrapp_parcelle',
                    visibility: true,
                    search: {
                        url: '/geoserver/wfs',
                        type: 'wfs'
                    }
                }
            },
            {
                id: '__CADASTRAPP_RASTER_LAYER__',
                owner: 'CADASTRAPP',
                actionType: 'overlay',
                options: {
                    id: '__CADASTRAPP_RASTER_LAYER__',
                    features: [],
                    type: 'vector',
                    name: 'searchPoints',
                    visibility: true
                }
            }
        ],
        cadastrapp: {
            configuration: {"cadastreLayerIdParcelle": "geo_parcelle"},
            selectionType: '',
            activePlotSelection: 1,
            styles: LAYER_STYLES,
            plots: [{
                selected: ['1'],
                data: [{ parcelle: "1", feature: { geometry: { type: "MultiPolygon",
                    coordinates: [[[-1.684853, 48.114508], [-1.68487, 48.114479]]]
                }, properties: { geo_parcelle: "1234"}}}]
            }]
        },
        styles: {},
        mapInfo: { enabled: false },
        controls: {cadastrapp: {enabled: true}}
    };
    let mockAxios;
    beforeEach(done => {
        mockAxios = new MockAdapter(axios);
        setTimeout(done);
    });

    afterEach(done => {
        mockAxios.restore();
        setTimeout(done);
    });

    it("mouseMoveMapEventEpic", done => {
        const features = [state.cadastrapp.plots[0].data[0].feature];
        mockAxios.onPost().reply(200, {features});
        testEpic(
            mouseMoveMapEventEpic,
            1,
            mouseMove({lat: 48.10, lng: -1.6}),
            actions => {
                expect(actions.length).toBe(1);
                actions.map(action=>{
                    switch (action.type) {
                    case SHOW_POPUP:
                        expect(action.parcelle).toBe('1234');
                        expect(action.position).toEqual({"lat": 48.1, "lng": -1.6});
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
    it("showPopupEpic", done => {
        const bulleInfo = {test: "Value"};
        mockAxios.onGet().reply(200, {bulleInfo});
        testEpic(
            showPopupEpic,
            4,
            showPopup('1234', {"lat": 48.1, "lng": -1.6}),
            actions => {
                expect(actions.length).toBe(4);
                actions.map(action=>{
                    switch (action.type) {
                    case LOADING:
                        expect(action.name).toEqual('popupLoading');
                        break;
                    case ADD_MAP_POPUP:
                        expect(action.id).toBeTruthy();
                        expect(action.popup).toBeTruthy();
                        break;
                    case SAVE_BUBBLE_INFO:
                        expect(action.data).toBeTruthy();
                        expect(action.data.bulleInfo).toBeTruthy();
                        expect(action.data.bulleInfo).toEqual(bulleInfo);
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
