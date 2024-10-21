import expect from 'expect';
import {convertFeaturesToAnnotationLayer} from "@js/extension/utils/download";
import { ANNOTATIONS } from '@mapstore/utils/LegacyAnnotationsUtils';

describe('download utils', () => {
    it("convertFeaturesToAnnotationLayer", () => {
        const state = {
            cadastrapp: {
                configuration:
                    {
                        cadastreLayerIdParcelle: 'testProp'
                    }
            }
        };

        const layer = {
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
        };

        const converted = convertFeaturesToAnnotationLayer(layer, state);
        expect(converted.features[0].geometry.type).toBe('Polygon');
        expect(converted.features[1].geometry.type).toBe(layer.features[1].geometry.type);
        expect(converted.features[0].properties.geometryTitle).toBe('SomeTitle');
        expect(converted.features[1].properties.geometryTitle).toBe('SomeTitle2');
        expect(converted.rowViewer).toBe(ANNOTATIONS);
    });
});
