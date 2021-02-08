import Rx from 'rxjs';

import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';
import { updateAdditionalLayer, removeAdditionalLayer } from '@mapstore/actions/additionallayers';
import { toggleMapInfoState } from '@mapstore/actions/mapInfo';
import { UPDATE_MAP_LAYOUT, updateMapLayout } from '../../../MapStore2/web/client/actions/maplayout';

import { registerEventListener, unRegisterEventListener } from '@mapstore/actions/map';
import { cleanPopups } from '@mapstore/actions/mapPopups';


import {
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID,
    CADASTRAPP_OWNER,
    MOUSE_EVENT, CONTROL_NAME
} from '../constants';

import { getConfiguration } from '../api';
import get from 'lodash/get';
import { configurationSelector } from '../selectors/cadastrapp';

import {
    SETUP,
    TEAR_DOWN,
    setConfiguration,
    setupCompleted,
    loading,
    toggleSelectionTool
} from '../actions/cadastrapp';
import { SET_CONTROL_PROPERTIES, setControlProperty } from '@mapstore/actions/controls';

// size o
const OFFSET = 660; // size of cadastrapp. Maybe parametrize. Now in css + this constant

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
            });
        const mapInfoEnabled = get(store.getState(), "mapInfo.enabled");
        return initStream$.concat(
            Rx.Observable.defer(() => {
                // here the configuration has been loaded
                const {
                    cadastreWMSLayerName,
                    cadastreWMSURL,
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
                ]).concat([...(mapInfoEnabled ? [toggleMapInfoState()] : [])]);
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
                layout,
                right: OFFSET,
                boundingMapRect: {
                    ...(layout.boundingMapRect || {}),
                    right: OFFSET
                }
            });
            return { ...action, source: 'cadastrapp' }; // add an argument to avoid infinite loop.
        });
/**
 * Auto-closes cadastrapp when catalog is open
 */
export const cadastrappAutoClose = (action$, store) =>
    action$.ofType(SET_CONTROL_PROPERTIES)
        .filter(() => isCadastrappOpen(store))
        .filter(({ control, properties }) => control === "metadataexplorer" && properties?.enabled) // open the catalog from TOC
        .map( () => setControlProperty(CONTROL_NAME, "enabled", false));

/**
 * Intercept cadastrapp close event.
 * - Removes the cadastre layer from the map
 */
export const cadastrappTearDown = (action$, {getState = ()=>{}}) =>
    action$.ofType(TEAR_DOWN).switchMap(() =>
        Rx.Observable.from([
            toggleSelectionTool(),
            removeAdditionalLayer({id: CADASTRAPP_RASTER_LAYER_ID, owner: CADASTRAPP_OWNER}),
            removeAdditionalLayer({id: CADASTRAPP_VECTOR_LAYER_ID, owner: CADASTRAPP_OWNER}),
            cleanPopups(),
            unRegisterEventListener(MOUSE_EVENT, CONTROL_NAME) // Reset map's mouse event trigger
        ]).concat([...(!get(getState(), "mapInfo.enabled") ? [toggleMapInfoState()] : [])]));
