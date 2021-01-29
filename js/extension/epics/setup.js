import Rx from 'rxjs';

import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';
import { updateAdditionalLayer, removeAdditionalLayer } from '@mapstore/actions/additionallayers';
import { setMapTrigger, toggleMapInfoState } from '@mapstore/actions/mapInfo';
import { cleanPopups } from '@mapstore/actions/mapPopups';


import {
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID,
    CADASTRAPP_OWNER
} from '../constants';

import { getConfiguration } from '../api';
import get from 'lodash/get';
import { configurationSelector } from '../selectors/cadastrapp';

import {
    SETUP,
    TEAR_DOWN,
    setConfiguration,
    loading,
    toggleSelectionTool
} from '../actions/cadastrapp';


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
                    setMapTrigger('hover') // Set map's mouse event trigger type
                ]).concat([...(mapInfoEnabled ? [toggleMapInfoState()] : [])]);

            }) // TODO: add cadastrapp layer
        ).let(
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
 * Intercept cadastrapp close event.
 * - Removes the cadastre layer from the map
 */
export const cadastrappTearDown = (action$, {getState = ()=>{}}) =>
    action$.ofType(TEAR_DOWN).switchMap(() =>
        Rx.Observable.from([
            toggleSelectionTool(),
            removeAdditionalLayer({id: CADASTRAPP_RASTER_LAYER_ID, owner: CADASTRAPP_OWNER}),
            removeAdditionalLayer({id: CADASTRAPP_VECTOR_LAYER_ID, owner: CADASTRAPP_OWNER}),
            cleanPopups()
        ]).concat([...(!get(getState(), "mapInfo.enabled") ? [toggleMapInfoState()] : [])]));
