import Rx from 'rxjs';
import { getParcelle } from '../api';


import { SELECTION_TYPES } from '../constants';

import {
    END_DRAWING,
    changeDrawingStatus
} from '@mapstore/actions/draw';

import {
    TOGGLE_SELECTION,
    TEAR_DOWN,
    addPlots,
    loading,
    showLandedPropertyInformation
} from '../actions/cadastrapp';

import { getCadastrappLayer, cadastreLayerIdParcelle } from '../selectors/cadastrapp';
import { getLayerJSONFeature } from '@mapstore/observables/wfs';
import { wrapStartStop } from '@mapstore/observables/epics';

import { workaroundDuplicatedParcelle } from '../utils/workarounds';


const CLEAN_ACTION = changeDrawingStatus("clean");
const DEACTIVATE_ACTIONS = [
    CLEAN_ACTION,
    changeDrawingStatus("stop")];
const deactivate = () => Rx.Observable.from(DEACTIVATE_ACTIONS);

/**
 * Extract the drawMethod for DrawSupport from the method
 * @param {string} selection the current tool selected
 */
function drawMethod(selection) {
    switch (selection) {
    case SELECTION_TYPES.POINT:
    case SELECTION_TYPES.LANDED_PROPERTY:
        return "Point";
    case SELECTION_TYPES.LINE_STRING:
        return "LineString";
    case SELECTION_TYPES.POLYGON:
        return "Polygon";
    default:
        return null;
    }
}

function createRequest(geometry, getState) {
    const layer = getCadastrappLayer(getState());
    return getLayerJSONFeature(layer, {
        filterType: "OGC", // CQL doesn't support LineString yet
        featureTypeName: layer.name,
        typeName: layer.name, // the layer name is not used
        ogcVersion: '1.1.0',
        spatialField: {
            attribute: "geom", // TODO: get the geom attribute from config
            geometry,
            operation: "INTERSECTS"
        }
    });
}
/**
 * Handle map selection tools and events
 */
export const cadastrappMapSelection = (action$, {getState = () => {}}) =>
    action$.ofType(TOGGLE_SELECTION).switchMap(({selectionType}) => {
        if (selectionType) {
            const startDrawingAction = changeDrawingStatus('start', drawMethod(selectionType), 'cadastrapp', [], { stopAfterDrawing: true });
            return action$.ofType(END_DRAWING).flatMap(
                ({ geometry }) => {
                    const parcelleProperty = cadastreLayerIdParcelle(getState());
                    // query WFS
                    return createRequest(geometry, getState)
                        .map( ({features = [], ...rest} = {}) => {
                            return {
                                ...rest,
                                features: features.filter(workaroundDuplicatedParcelle(parcelleProperty)) // removes duplicates
                            };
                        })
                        .switchMap(({ features = []} = {}) => {
                            // retrieve all parcelles data from API
                            return Rx.Observable.of(
                                ...features
                                    .map((feature) => {
                                        const parcelle = feature?.properties[parcelleProperty];
                                        return getParcelle({ parcelle })
                                            // the API returns an array, in this case only the first is ok, and associate the feature to it.
                                            .then(([p]) => ({...p, feature}));
                                    })
                            )
                                .mergeAll(5)
                                .map(parcelle => {
                                    if (selectionType === SELECTION_TYPES.LANDED_PROPERTY) {
                                        return showLandedPropertyInformation(parcelle);
                                    }
                                    return addPlots([parcelle]);
                                }).let(wrapStartStop(
                                    [loading(true, "features")],
                                    loading(false, "features")
                                ))
                                .merge(

                                );
                        })
                        .merge(
                            Rx.Observable.of(startDrawingAction).delay(200) // reactivate drawing
                        );
                    // TODO: Re-activate the tool;
                })
                .startWith(startDrawingAction)
                .takeUntil(action$.ofType(TEAR_DOWN))
                .concat(deactivate()); // on close, deactivate any draw session remaining
        }
        // if the selection type is not present, it means has been reset, so deactivate any drawing tool
        return deactivate();
    });
