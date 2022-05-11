/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from "expect";
import { testEpic } from "@mapstore/epics/__tests__/epicTestUtils";
import { ZOOM_TO_EXTENT } from "@mapstore/actions/map";
import { UPDATE_ADDITIONAL_LAYER } from "@mapstore/actions/additionallayers";
import { zoomToExtentAllResults } from "../../actions/cadastrapp";
import { zoomToExtentAllResultsEpic } from "../../epics/layerSync";
import {CADASTRAPP_OWNER, CADASTRAPP_VECTOR_LAYER_ID, LAYER_STYLES} from "@js/extension/constants";
import {getAllPlotFeatures} from "@js/extension/selectors/cadastrapp";

describe("layerSync Epics", () => {
    const state = {
        cadastrapp: {
            activePlotSelection: 1,
            styles: LAYER_STYLES,
            plots: [{
                selected: ['1'],
                data: [{ parcelle: "1", feature: { geometry: { type: "MultiPolygon",
                    coordinates: [[[-1.684853, 48.114508], [-1.68487, 48.114479]]]
                }}}]
            },
            {
                selected: [],
                data: [{ parcelle: "1", feature: { geometry: { type: "MultiPolygon",
                    coordinates: [[[-1.684853, 48.114508], [-1.68487, 48.114479]]]
                }}}]
            }]
        },
        styles: {},
        mapInfo: { enabled: true }
    };

    it("zoomToExtentAllResultsEpic", done => {
        const features = getAllPlotFeatures(state);
        testEpic(
            zoomToExtentAllResultsEpic,
            2,
            zoomToExtentAllResults(),
            actions => {
                expect(actions.length).toBe(2);
                actions.map(action=>{
                    switch (action.type) {
                    case ZOOM_TO_EXTENT:
                        break;
                    case UPDATE_ADDITIONAL_LAYER:
                        expect(action.id).toBe(CADASTRAPP_VECTOR_LAYER_ID);
                        expect(action.owner).toBe(CADASTRAPP_OWNER);
                        expect(action.actionType).toBe('overlay');
                        expect(action.options.features).toEqual(features);
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
