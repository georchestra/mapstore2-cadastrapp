import Rx from 'rxjs';

import {
    updateAdditionalLayer
} from '@mapstore/actions/additionallayers';
import {
    SETUP_COMPLETED,
    ADD_PLOTS,
    REMOVE_PLOTS,
    SET_ACTIVE_PLOT_SELECTION,
    REMOVE_PLOT_SELECTION,
    SELECT_PLOTS,
    DESELECT_PLOTS,
    SET_LAYER_STYLE,
    SET_STYLES,
    ZOOM_TO_RESULTS,
    UPDATE_LAYER_STYLE,
    ADD_PLOT_SELECTION
} from '../actions/cadastrapp';
import {
    getCurrentPlotFeatures,
    getCadastrappVectorLayer,
    getAllPlotFeatures
} from '../selectors/cadastrapp';

import { zoomToExtent } from '@mapstore/actions/map';
import bbox from '@turf/bbox';

import {
    CADASTRAPP_VECTOR_LAYER_ID,
    CADASTRAPP_OWNER
} from '../constants';


export const syncLayerForPlots = (action$, {getState = () => {}})=>
    action$.ofType(SETUP_COMPLETED, ADD_PLOT_SELECTION, ADD_PLOTS, REMOVE_PLOTS, SET_ACTIVE_PLOT_SELECTION, REMOVE_PLOT_SELECTION, SELECT_PLOTS, DESELECT_PLOTS, SET_LAYER_STYLE, SET_STYLES, UPDATE_LAYER_STYLE) // actions that modify the layer, so it needs an update.
        .switchMap(() => {
            const features = getCurrentPlotFeatures(getState());
            const options = getCadastrappVectorLayer(getState());
            return Rx.Observable.of(
                updateAdditionalLayer(
                    CADASTRAPP_VECTOR_LAYER_ID,
                    CADASTRAPP_OWNER,
                    "overlay", {
                        ...options,
                        features
                    }));
        });

export const zoomToExtentAllResultsEpic = (action$, {getState = () => {}})=>
    action$.ofType(ZOOM_TO_RESULTS).switchMap(() => {
        const features = getAllPlotFeatures(getState());
        const options = getCadastrappVectorLayer(getState());
        if (features.length) {
            return Rx.Observable.of(
                zoomToExtent(bbox({type: "FeatureCollection", features}), "EPSG:4326"),
                updateAdditionalLayer(
                    CADASTRAPP_VECTOR_LAYER_ID,
                    CADASTRAPP_OWNER,
                    "overlay", {...options, features}
                )
            );
        }
        return Rx.Observable.empty();
    });
