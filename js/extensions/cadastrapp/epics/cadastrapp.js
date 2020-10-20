import Rx from 'rxjs';

import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';
import { addLayer, removeLayer } from '@mapstore/actions/layers';
import { getLayerFromId } from '@mapstore/selectors/layers';

const { CADASTRAPP_LAYER_ID } = require('../constants');

import { getConfiguration } from '../api';
import { configurationSelector } from '../selectors/cadastrapp';

import {
    SETUP,
    TEAR_DOWN,
    setConfiguration,
    loading
} from '../actions/cadastrapp';


/**
 * Intercepts actions of type CADASTRAPP:SETUP.
 * - Load configuration if missing
 * - adds the cadastre layer on the map
 * - TODO: disable getFeatureInfo
 */
export const cadastrappSetup = (action$, {getState = () => {}}) =>
    action$.ofType(SETUP).switchMap( () => {
        // initStream loads configuration if not loaded yet
        const isConfigurationLoaded = !!configurationSelector(getState());
        let initStream$ = isConfigurationLoaded
            ? Rx.Observable.empty()
            : Rx.Observable.defer(() => getConfiguration())
                .switchMap(data => {
                    return Rx.Observable.of(setConfiguration(data));
                });
        const layer = getLayerFromId(getState(), CADASTRAPP_LAYER_ID);
        return initStream$.concat(
            layer
                ? Rx.Observable.empty()
                : Rx.Observable.defer( () => {
                    // here the configuration has been loaded
                    const {
                        cadastreWMSLayerName,
                        cadastreWMSURL,
                        cadastreWFSURL
                    } = configurationSelector(getState());
                    return Rx.Observable.of(addLayer({
                        id: CADASTRAPP_LAYER_ID,
                        type: "wms",
                        name: cadastreWMSLayerName,
                        url: cadastreWMSURL,
                        visibility: true,
                        search: {
                            url: cadastreWFSURL,
                            type: "wfs"
                        }

                    }, true));
                }) // TODO: add cadastrapp layer
        ).let(
            wrapStartStop(
                loading(true, 'configuration'),
                loading(false, 'configuration'),
                e => {
                    console.log(e); // eslint-disable-line no-console
                    return Rx.Observable.of(error({title: "Error", message: "Unable to setup cadastrapp"}), loading(false, 'configuration'));

                }
            )
        );
    });

/**
 * Intercept cadastrapp close event.
 * - Removes the cadastre layer from the map
 */
export const cadastrappTearDown = action$ =>
    action$.ofType(TEAR_DOWN).switchMap(() => Rx.Observable.of(removeLayer(CADASTRAPP_LAYER_ID)));
