
import Rx from 'rxjs';
import { OPEN_LP, ZOOM_TO_SELECTION } from '../actions/cadastrapp';
import { getCurrentPlotFeatures, getSelectedFeatures } from '../selectors/cadastrapp';
import { zoomToExtent } from '@mapstore/actions/map';
import bbox from '@turf/bbox';
import { set } from 'lodash';


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
 * Handles open landry property event
 */
export function cadastrappOpenLP(action$) {
    return action$.ofType(OPEN_LP)
        .do(() => setTimeout(() => alert("TODO", 0)))
        .switchMap(({parcelle}) => {
            set(window, "GEOR.Addons.Cadastre.UF.parcelleId", parcelle); // this is required by the opened window.
            window.open("/mapfish/ws/addons/cadastrapp/html/ficheUniteFonciere.html");
            // TODO: ficheUniteFonciere requires to clone original OL2 map. This is not feasable. We may need to re-create the existing functionality for MapStore
            return Rx.Observable.empty();
        });
}
