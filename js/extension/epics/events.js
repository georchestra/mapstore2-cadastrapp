import Rx from 'rxjs';
import {SAVE_AS_ANNOTATION, ZOOM_TO_SELECTION} from '../actions/cadastrapp';
import {getCadastrappVectorLayer, getCurrentPlotFeatures, getSelectedFeatures} from '../selectors/cadastrapp';
import { zoomToExtent } from '@mapstore/actions/map';
import bbox from '@turf/bbox';
import {convertFeaturesToAnnotation} from "@js/extension/utils/download";
import {setControlProperty} from "@mapstore/actions/controls";
import {newAnnotation, setEditingFeature} from "@mapstore/actions/annotations";


/**
 * Performs a zoom to extent to the current selection.
 * If no feature selected, zooms to the whole set of the current plots table.
 */
export function cadastrappZoomToSelection(action$, store) {
    return action$.ofType(ZOOM_TO_SELECTION).switchMap(() => {
        const selectedFeatures = getSelectedFeatures(store.getState()) ?? [];
        const features = getCurrentPlotFeatures(store.getState()) ?? [];
        const zoomToFeatures = selectedFeatures.length > 0 ? selectedFeatures : features;
        if (zoomToFeatures.length >= 0) {
            return Rx.Observable.of(zoomToExtent(bbox({type: "FeatureCollection", features: zoomToFeatures}), "EPSG:4326"));
        }
        return Rx.Observable.empty();
    });
}

/**
 * Saves cadastrapp selection to the annotation
 */
export function cadastrappSaveAsAnnotation(action$, store) {
    return action$.ofType(SAVE_AS_ANNOTATION).switchMap(() => {
        const state = store.getState();
        const collection = convertFeaturesToAnnotation(getCadastrappVectorLayer(state), state);
        return Rx.Observable.of(
            setControlProperty('annotations', 'enabled', true),
            newAnnotation(),
            setEditingFeature(collection)
        );
    });
}

