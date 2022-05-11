import Rx from 'rxjs';

import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';
import { updateAdditionalLayer, removeAdditionalLayer } from '@mapstore/actions/additionallayers';
import { hideMapinfoMarker, toggleMapInfoState, purgeMapInfoResults } from '@mapstore/actions/mapInfo';
import { UPDATE_MAP_LAYOUT, updateMapLayout } from '@mapstore/actions/maplayout';

import { registerEventListener, unRegisterEventListener } from '@mapstore/actions/map';
import { cleanPopups } from '@mapstore/actions/mapPopups';


import {
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID,
    CADASTRAPP_OWNER,
    MOUSE_EVENT, CONTROL_NAME
} from '../constants';

import { getConfiguration } from '../api';
import {findIndex, keys, get} from "lodash";

import {
    SETUP,
    TEAR_DOWN,
    setConfiguration,
    setupCompleted,
    loading,
    toggleSelectionTool, TOGGLE_SELECTION
} from '../actions/cadastrapp';
import {
    SET_CONTROL_PROPERTIES,
    SET_CONTROL_PROPERTY,
    TOGGLE_CONTROL,
    setControlProperty
} from '@mapstore/actions/controls';
import {closeFeatureGrid, OPEN_FEATURE_GRID} from "@mapstore/actions/featuregrid";
import {START_DRAWING} from "@mapstore/actions/annotations";
import {configurationSelector, currentSelectionToolSelector} from '../selectors/cadastrapp';
import {isFeatureGridOpen} from "@mapstore/selectors/featuregrid";
import {coordinateEditorEnabledSelector} from "@mapstore/selectors/annotations";
import {CHANGE_DRAWING_STATUS} from "@mapstore/actions/draw";

// size o
const OFFSET = 550; // size of cadastrapp. Maybe parametrize. Now in css + this constant
const shutdownList = ['metadataexplorer', 'details', 'mapcatalog', 'maptemplates', 'userExtensions', 'FeatureEditor'];
const toggleOffList = ['measure', "street-view"];

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
            .startWith(...(isFeatureGridOpen ? [closeFeatureGrid()] : []));
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
                return Rx.Observable.from([
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
                        }, true),
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
                    registerEventListener(MOUSE_EVENT, CONTROL_NAME) // Set map's mouse event trigger type
                ]).concat([...(mapInfoEnabled ? [toggleMapInfoState(), hideMapinfoMarker()] : [])]);
            })
        )
            .concat(Rx.Observable.of(setupCompleted())) // required to sync the layer the first time (if closed/reopen)
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
                right: OFFSET + (layout?.right ?? 0),
                boundingMapRect: {
                    ...(layout.boundingMapRect || {}),
                    right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0)
                },
                rightPanel: true
            });
            return { ...action, source: 'cadastrapp' }; // add an argument to avoid infinite loop.
        });

export const cadastrappCloseAnnotationsOnToolToggledOn = (action$, store) =>
    action$.ofType(TOGGLE_SELECTION)
        .filter(({ selectionType }) => !!selectionType && coordinateEditorEnabledSelector(store.getState())
        )
        .map(() => {
            return purgeMapInfoResults();
        });

/**
 * Auto-closes cadastrapp when one of the shutdown-trigger tools is open or when Feature editor is open
 */
export const cadastrappAutoClose = (action$, store) =>
    action$.ofType(SET_CONTROL_PROPERTIES, SET_CONTROL_PROPERTY, TOGGLE_CONTROL, OPEN_FEATURE_GRID)
        .filter(() => isCadastrappOpen(store))
        .filter(({control, property, properties = [], type}) => {
            const state = store.getState();
            const controlState = state.controls[control]?.enabled;
            switch (type) {
            case OPEN_FEATURE_GRID:
                return true;
            case SET_CONTROL_PROPERTY:
            case TOGGLE_CONTROL:
                return (property === 'enabled' || !property) && controlState && shutdownList.includes(control);
            default:
                return findIndex(keys(properties), prop => prop === 'enabled') > -1 && controlState && shutdownList.includes(control);
            }
        })
        .map( () => {
            return setControlProperty(CONTROL_NAME, "enabled", false);
        });

export const toggleCadastrapToolOnAnnotationsDrawing = (action$, store) =>
    action$.ofType(START_DRAWING, CHANGE_DRAWING_STATUS)
        .filter(({type, status, owner}) => {
            const currentSelectionTool = currentSelectionToolSelector(store.getState());
            switch (type) {
            case CHANGE_DRAWING_STATUS:
                return !!currentSelectionTool && ((status === 'drawOrEdit' && owner === 'annotations') || (status === 'start' && owner === 'queryform'));
            case START_DRAWING:
            default:
                return !!currentSelectionTool;
            }
        })
        .switchMap( () => {
            let actions = [
                toggleSelectionTool(null, false)
            ];
            return Rx.Observable.from(actions);
        });


export const toggleCadastrapToolOnPluginActivated = (action$, store) =>
    action$.ofType(SET_CONTROL_PROPERTIES, SET_CONTROL_PROPERTY, TOGGLE_CONTROL)
        .filter(() => isCadastrappOpen(store))
        .filter(({control, property, properties = [], type}) => {
            const state = store.getState();
            const controlState = state.controls[control]?.enabled;
            switch (type) {
            case SET_CONTROL_PROPERTY:
            case TOGGLE_CONTROL:
                return (property === 'enabled' || !property) && controlState && toggleOffList.includes(control);
            default:
                return findIndex(keys(properties), prop => prop === 'enabled') > -1 && controlState && toggleOffList.includes(control);
            }
        })
        .map( () => toggleSelectionTool(null, false));


export const toogleToolOnCadastrappToolActivated = (action$, store) =>
    action$.ofType(TOGGLE_SELECTION).switchMap(({selectionType}) => {
        if (selectionType) {
            const actions = [];
            const state = store.getState();
            toggleOffList.forEach((controlName) => {
                const enabled = get(state, ['controls', controlName, 'enabled'], false);
                enabled && actions.push(setControlProperty(controlName, 'enabled', null));
            });
            return Rx.Observable.from(actions);
        }
        // if the selection type is not present, it means has been reset, so deactivate any drawing tool
        return Rx.Observable.empty();
    });

export const toggleUrbanismeToolOffOnCadastrappToolActivated = (action$) =>
    action$.ofType(TOGGLE_SELECTION).switchMap(({selectionType}) => {
        if (selectionType) {
            return Rx.Observable.from([{
                type: "URBANISME:TOGGLE_TOOL",
                activeTool: null
            }]);
        }
        // if the selection type is not present, it means has been reset, so deactivate any drawing tool
        return Rx.Observable.empty();
    });

/**
 * Intercept cadastrapp close event.
 * - Removes the cadastre layer from the map
 */
export const cadastrappTearDown = (action$, {getState = ()=>{}}) =>
    action$.ofType(TEAR_DOWN).switchMap(() => {
        const cadastrappIsDrawOwner = get(getState(), 'draw.drawOwner', false) === 'cadastrapp';
        return Rx.Observable.from([
            toggleSelectionTool(null, cadastrappIsDrawOwner),
            removeAdditionalLayer({id: CADASTRAPP_RASTER_LAYER_ID, owner: CADASTRAPP_OWNER}),
            removeAdditionalLayer({id: CADASTRAPP_VECTOR_LAYER_ID, owner: CADASTRAPP_OWNER}),
            cleanPopups(),
            unRegisterEventListener(MOUSE_EVENT, CONTROL_NAME) // Reset map's mouse event trigger
        ]).concat([...(!get(getState(), "mapInfo.enabled") ? [toggleMapInfoState()] : [])]);
    });
