import Rx from 'rxjs';

import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';
import { updateAdditionalLayer, removeAdditionalLayer } from '@mapstore/actions/additionallayers';
import {
    hideMapinfoMarker, toggleMapInfoState,
    closeIdentify, TOGGLE_MAPINFO_STATE, changeMapInfoState
} from '@mapstore/actions/mapInfo';
import {UPDATE_MAP_LAYOUT, updateDockPanelsList, updateMapLayout} from '@mapstore/actions/maplayout';

import { registerEventListener, unRegisterEventListener } from '@mapstore/actions/map';
import { cleanPopups } from '@mapstore/actions/mapPopups';


import {
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID,
    CADASTRAPP_OWNER,
    MOUSE_EVENT, CONTROL_NAME
} from '../constants';

import { getConfiguration } from '../api';
import {get} from "lodash";

import {
    SETUP,
    setConfiguration,
    setupCompleted,
    loading,
    toggleSelectionTool, TOGGLE_SELECTION, initializedLayers
} from '../actions/cadastrapp';
import {
    SET_CONTROL_PROPERTIES,
    SET_CONTROL_PROPERTY,
    TOGGLE_CONTROL
} from '@mapstore/actions/controls';
import { mapInfoDisabledSelector } from '@mapstore/selectors/mapInfo';
import {configurationSelector, currentSelectionToolSelector} from '../selectors/cadastrapp';
import {shutdownToolOnAnotherToolDrawing} from "@mapstore/utils/ControlUtils";

const OFFSET = 550; // size of cadastrapp. Maybe parametrize. Now in css + this constant

/**
 * utility function to check if the cadastrapp panel is open
 */
function isCadastrappOpen(store) {
    const state = store.getState();
    return state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false;
}

/**
 * Intercepts actions of type CADASTRAPP:SETUP.
 * - Load configuration if missing
 * - adds the cadastre layer on the map
 * - TODO: disable getFeatureInfo
 */
export const cadastrappSetup = (action$, store) =>
    action$.ofType(SETUP).switchMap(() => {
        // initStream loads configuration if not loaded yet
        let initStream$ = Rx.Observable.defer(() => getConfiguration())
            .switchMap(data => {
                return Rx.Observable.of(setConfiguration(data));
            })
            .startWith({
                type: 'MAP_LAYOUT:UPDATE_DOCK_PANELS',
                name: 'cadastrapp',
                action: 'add',
                location: 'right'
            });
        const mapInfoEnabled = get(store.getState(), "mapInfo.enabled");
        return initStream$.concat(
            Rx.Observable.defer(() => {
                // here the configuration has been loaded
                const {
                    cadastreWMSLayerName,
                    cadastreWMSURL,
                    cadastreWFSLayerName,
                    cadastreWFSURL
                } = configurationSelector(store.getState());
                return Rx.Observable.of(
                    updateAdditionalLayer(
                        CADASTRAPP_RASTER_LAYER_ID,
                        CADASTRAPP_OWNER,
                        'overlay',
                        {
                            id: CADASTRAPP_RASTER_LAYER_ID,
                            type: "wms",
                            name: cadastreWMSLayerName,
                            url: cadastreWMSURL,
                            visibility: true,
                            search: {
                                url: cadastreWFSURL,
                                name: cadastreWFSLayerName,
                                type: "wfs"
                            }
                        }),
                    registerEventListener(MOUSE_EVENT, CONTROL_NAME) // Set map's mouse event trigger type
                ).concat([
                    updateAdditionalLayer(
                        CADASTRAPP_VECTOR_LAYER_ID,
                        CADASTRAPP_OWNER,
                        'overlay',
                        {
                            id: CADASTRAPP_VECTOR_LAYER_ID,
                            features: [],
                            type: "vector",
                            name: "searchPoints",
                            visibility: true
                        }),
                    ...(mapInfoEnabled ? [toggleMapInfoState(), hideMapinfoMarker()] : [])
                ]);
            })
        )
            .concat(Rx.Observable.of(setupCompleted())) // subscribes app to sync selection layer upon several actions
            .concat(Rx.Observable.of(initializedLayers())) // required to sync the layer the first time (if closed/reopen)
            .let(
                wrapStartStop(
                    loading(true, 'configuration'),
                    loading(false, 'configuration'),
                    e => {
                        console.log(e); // eslint-disable-line no-console
                        return Rx.Observable.of(error({ title: "Error", message: "Unable to setup cadastrapp" }), loading(false, 'configuration'));
                    }
                )
            );
    });

/**
 * Re-trigger an update map layout with the margin to adjust map layout and show navigation toolbar. This
 * also keep the zoom to extent offsets aligned with the current visibile window, so when zoom the cadastrapp panel
 * is considered as a right offset and it will not cover the zoomed features.
 */
export const cadastrappMapLayout = (action$, store) =>
    action$.ofType(UPDATE_MAP_LAYOUT)
        .filter(() => isCadastrappOpen(store))
        .filter(({source}) => {
            return source !== 'cadastrapp';
        })
        .map(({layout}) => {
            const action = updateMapLayout({
                ...layout,
                right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0),
                boundingMapRect: {
                    ...(layout.boundingMapRect || {}),
                    right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0)
                },
                rightPanel: true
            });
            return { ...action, source: 'cadastrapp' }; // add an argument to avoid infinite loop.
        });

/**
 * Toggle cadastrapp measurement tool off when one of the drawing tools takes control
 * @param action$
 * @param store
 * @returns {Observable<unknown>}
 */
export const tearDownCadastrappOnDrawToolActive = (action$, store) => shutdownToolOnAnotherToolDrawing(action$, store, 'cadastrapp',
    (state) => {
        const cadastrappIsDrawOwner = get(state, 'draw.drawOwner', false) === 'cadastrapp';
        return Rx.Observable.from([
            toggleSelectionTool(null, cadastrappIsDrawOwner)]);
    });

/**
 * Toggle identify off when cadastrap selection tool is active
 * @param action$
 * @param store
 * @returns {Observable<unknown>}
 */
export const toggleMapInfoOnActiveTool = (action$, {getState}) =>
    action$
        .ofType(TOGGLE_SELECTION)
        .filter(() => {
            const state = getState();
            return currentSelectionToolSelector(state) && !mapInfoDisabledSelector(state);
        })
        .switchMap(() => {
            return Rx.Observable.of(changeMapInfoState(false));
        });


/**
 * Ensures that the urbanisme plugin active tool is getting deactivated when Identify tool is activated
 * @memberof epics.urbanisme
 * @param {observable} action$ manages `TOGGLE_MAPINFO_STATE`
 * @param getState
 * @return {observable}
 */
export const deactivateToolOnIdentifyEnabledEpic = (action$, {getState}) =>
    action$
        .ofType(TOGGLE_MAPINFO_STATE)
        .filter(() => !mapInfoDisabledSelector(getState()))
        .switchMap(() => {
            const cadastrappSelectionTool = currentSelectionToolSelector(getState());
            const cadastrappIsDrawOwner = get(getState(), 'draw.drawOwner', false) === 'cadastrapp';
            return cadastrappSelectionTool
                ? Rx.Observable.from([
                    toggleSelectionTool(null, cadastrappIsDrawOwner),
                    closeIdentify()
                ])
                : Rx.Observable.empty();
        });

/**
 * Intercept cadastrapp close event.
 * - Removes the cadastre layer from the map
 */
export const cadastrappTearDown = (action$, store) =>
    action$.ofType(SET_CONTROL_PROPERTIES, SET_CONTROL_PROPERTY, TOGGLE_CONTROL)
        .filter(({ control }) => control === CONTROL_NAME && !isCadastrappOpen(store))
        .switchMap(() => {
            const state = store.getState();
            const cadastrappIsDrawOwner = get(state, 'draw.drawOwner', false) === 'cadastrapp';
            return Rx.Observable.from([
                updateDockPanelsList(CONTROL_NAME, 'remove', 'right'),
                toggleSelectionTool(null, cadastrappIsDrawOwner),
                removeAdditionalLayer({id: CADASTRAPP_RASTER_LAYER_ID, owner: CADASTRAPP_OWNER}),
                removeAdditionalLayer({id: CADASTRAPP_VECTOR_LAYER_ID, owner: CADASTRAPP_OWNER}),
                cleanPopups(),
                unRegisterEventListener(MOUSE_EVENT, CONTROL_NAME) // Reset map's mouse event trigger
            ]).concat([...(!get(state, "mapInfo.enabled") ? [toggleMapInfoState()] : [])]);
        });
