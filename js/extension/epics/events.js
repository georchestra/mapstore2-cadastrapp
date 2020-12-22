
import Rx from 'rxjs';
import { ZOOM_TO_SELECTION } from '../actions/cadastrapp';
import { getCurrentPlotFeatures, getSelectedFeatures } from '../selectors/cadastrapp';
import { zoomToExtent } from '@mapstore/actions/map';
import bbox from '@turf/bbox';

/**
 * Performs a zoom to extent to the current selection.
 * If no feature selected, zooms to the whole set of the current plots table.
 */
export function zoomToSelection(action$, store) {
    return action$.ofType(ZOOM_TO_SELECTION).switchMap(() => {
        const selectedFeatures = getSelectedFeatures(store.getState()) ?? [];
        const features = getCurrentPlotFeatures(store.getState()) ?? [];
        const zoomToFeatures = selectedFeatures.length >= 0 ? selectedFeatures : features;
        if (zoomToFeatures.length >= 0) {
            return Rx.Observable.of(zoomToExtent(bbox({type: "FeatureCollection", features: zoomToFeatures}), "EPSG:4326"));
        }
        return Rx.Observable.empty();
    });
}
