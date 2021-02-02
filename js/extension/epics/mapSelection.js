import Rx from 'rxjs';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {getInfoBulle, getParcelle} from '../api';
import uuid from 'uuid';

import {SELECTION_TYPES, MOUSE_EVENT, CADASTRAPP_OWNER, CONTROL_NAME, DEFAULT_POPUP_PROPS} from '../constants';
import { error } from '@mapstore/actions/notifications';
import {
    END_DRAWING,
    changeDrawingStatus
} from '@mapstore/actions/draw';

import {
    TOGGLE_SELECTION,
    TEAR_DOWN,
    addPlots,
    loading,
    openLP,
    saveBubbleInfo,
    SHOW_POPUP,
    showPopup, SAVE_BUBBLE_INFO
} from '../actions/cadastrapp';

import {
    getCadastrappLayer,
    cadastreLayerIdParcelle,
    cadastrappEnabledSelector,
    currentSelectionToolSelector,
    popupPluginCfgSelector, cadastrappPluginCfgSelector
} from '../selectors/cadastrapp';
import { getLayerJSONFeature } from '@mapstore/observables/wfs';
import { wrapStartStop } from '@mapstore/observables/epics';
import { MOUSE_MOVE, MOUSE_OUT, registerEventListener, unRegisterEventListener } from '@mapstore/actions/map';
import { addPopup, cleanPopups } from '@mapstore/actions/mapPopups';
import { mapSelector } from '@mapstore/selectors/map';

import { workaroundDuplicatedParcelle } from '../utils/workarounds';
import PopupViewer from '../components/popup/PopupViewer';


const CLEAN_ACTION = changeDrawingStatus("clean");
const DEACTIVATE_ACTIONS = [
    CLEAN_ACTION,
    changeDrawingStatus("stop"),
    registerEventListener(MOUSE_EVENT, CONTROL_NAME)
];
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

const getFeatures = (geometry, getState, parcelleProperty) => {
    return createRequest(geometry, getState)
        .map( ({features = [], ...rest} = {}) => {
            return {
                ...rest,
                features: features.filter(workaroundDuplicatedParcelle(parcelleProperty)) // removes duplicates
            };
        });
};

/**
 * Generate a simple point geometry using position data
 * @param {object} point/position data from the map
 * @return {{coordinates: [number, string], projection: string, type: string}|*} geometry of type Point
 */
const getGeometry = point => {
    const geometry = point?.geometricFilter?.value?.geometry;
    if (geometry) {
        return geometry;
    }
    let lng = point.lng || point.latlng.lng;
    let lngCorrected = lng - 360 * Math.floor(lng / 360 + 0.5);
    return {
        coordinates: [lngCorrected, point.lat || point.latlng.lat],
        projection: "EPSG:4326",
        type: "Point"
    };
};

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
                    return getFeatures(geometry, getState, parcelleProperty)
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
                                        return openLP(parcelle);
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
                .merge(Rx.Observable.of(unRegisterEventListener(MOUSE_EVENT, CONTROL_NAME))) // Reset map's mouse event trigger type
                .startWith(startDrawingAction)
                .takeUntil(action$.ofType(TEAR_DOWN))
                .concat(deactivate()); // on close, deactivate any draw session remaining
        }
        // if the selection type is not present, it means has been reset, so deactivate any drawing tool
        return deactivate();
    });

/**
 * Generates geometry data and fetches feature info obtained from mouse over event position on map
 * @memberof epics.mapSelection
 * @param {observable} action$ manages `MOUSE_MOVE`
 * @param {object} store
 * @return {observable}
 */
export const mouseMovePopupEpic = (action$, {getState}) =>
    action$.ofType(MOUSE_MOVE)
        .debounceTime(popupPluginCfgSelector(getState())?.timeToShow || DEFAULT_POPUP_PROPS.TIMETOSHOW)
        .filter(()=>
            cadastrappEnabledSelector(getState()) // Cadastrapp enabled
            && !currentSelectionToolSelector(getState())  // Drawing tool disabled
            && mapSelector(getState()).zoom >= (popupPluginCfgSelector(getState())?.minZoom || DEFAULT_POPUP_PROPS.MINZOOM) // Within min accepted zoom
        )
        .switchMap(({position}) => {
            const state = getState();
            const geometry = getGeometry(position);
            const parcelleProperty = cadastreLayerIdParcelle(state);
            const isMouseOut = state.mousePosition?.mouseOut || false;
            if (isMouseOut) return Rx.Observable.of(cleanPopups());
            return getFeatures(geometry, getState, parcelleProperty)
                .switchMap(({features = []})=> {
                    if (isEmpty(features)) return Rx.Observable.of(cleanPopups()); // Hide any existing popups
                    const [feature] = features;
                    const parcelle = feature?.properties[parcelleProperty];
                    return Rx.Observable.of(showPopup(parcelle, position));
                });
        });

/**
 * Adds a popup onto the map with popup viewer loaded with InfoBulle
 * @memberof epics.mapSelection
 * @param {observable} action$ manages `SHOW_POPUP`
 * @param {object} store
 * @return {observable}
 */
export const showPopupEpic = (action$, {getState = () => {}}) =>
    action$.ofType(SHOW_POPUP)
        .switchMap(({parcelle, position})=> {
            return Rx.Observable.defer(()=>getInfoBulle(parcelle, cadastrappPluginCfgSelector(getState())?.foncier).then(data=> saveBubbleInfo(data)))
                .merge(Rx.Observable.of(addPopup(uuid(), { component: PopupViewer,
                    maxWidth: 600,
                    position: {coordinates: position ? position.rawPos : []},
                    autoPanMargin: 70,
                    autoPan: true
                })),
                action$.ofType(MOUSE_MOVE, SAVE_BUBBLE_INFO)
                    .switchMap((action)=>
                        (action.type === MOUSE_MOVE && !isEqual(position, action?.position)) // When mouse move to a different position clear popup
                            ? Rx.Observable.of(cleanPopups())
                            : !isEmpty(action.data)
                                ? Rx.Observable.of(loading(false, "popupLoading"))
                                : Rx.Observable.empty()
                    )
                ).let(
                    wrapStartStop(
                        [loading(true, "popupLoading")],
                        loading(false, "popupLoading"),
                        () => {
                            return Rx.Observable.of(
                                error({ title: "Error", message: "cadastrapp.popup.error" }),
                                loading(false, 'popupLoading')
                            );
                        }
                    )
                ) // When mouse move out clear popup
                .concat(action$.ofType(MOUSE_OUT).switchMap(()=> Rx.Observable.of(cleanPopups())));
        });
