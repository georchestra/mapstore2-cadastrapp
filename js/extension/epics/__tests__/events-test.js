/*
 * Copyright 2022, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from "expect";
import { testEpic } from "@mapstore/epics/__tests__/epicTestUtils";
import {saveAsAnnotation} from "../../actions/cadastrapp";
import {CADASTRAPP_VECTOR_LAYER_ID} from "@js/extension/constants";
import {cadastrappSaveAsAnnotation} from "@js/extension/epics/events";
import {SET_CONTROL_PROPERTY} from "@mapstore/actions/controls";
import {NEW_ANNOTATION, SET_EDITING_FEATURE} from "@mapstore/actions/annotations";

describe("download Epics", () => {
    const state = {
        cadastrapp: {
            configuration:
                {
                    cadastreLayerIdParcelle: 'testProp'
                }
        },
        additionallayers: [
            {
                id: CADASTRAPP_VECTOR_LAYER_ID,
                options: {
                    id: CADASTRAPP_VECTOR_LAYER_ID,
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'MultiPolygon',
                                coordinates: [
                                    [
                                        [
                                            [0, 0],
                                            [0, 1],
                                            [1, 1],
                                            [0, 0]
                                        ]
                                    ]
                                ]
                            },
                            properties: {
                                testProp: 'SomeTitle'
                            },
                            style: {
                                fillColor: '#81BEF7',
                                opacity: 0.6,
                                fillOpacity: 0.6,
                                color: '#111111',
                                weight: 4
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [
                                    [
                                        [0, 0],
                                        [0, 1],
                                        [1, 1],
                                        [0, 0]
                                    ]
                                ]
                            },
                            properties: {
                                testProp: 'SomeTitle2'
                            },
                            style: {
                                fillColor: '#81BEF7',
                                opacity: 0.6,
                                fillOpacity: 0.6,
                                color: '#111111',
                                weight: 4
                            }
                        }
                    ]
                }
            }
        ]
    };

    it("cadastrappSaveAsAnnotation", done => {
        testEpic(
            cadastrappSaveAsAnnotation,
            3,
            saveAsAnnotation(),
            actions => {
                expect(actions.length).toBe(3);
                actions.map(action=>{
                    switch (action.type) {
                    case SET_CONTROL_PROPERTY:
                    case NEW_ANNOTATION:
                        break;
                    case SET_EDITING_FEATURE:
                        expect(action.feature.features.length).toBe(2);
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
