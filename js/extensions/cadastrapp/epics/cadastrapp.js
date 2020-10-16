import Rx from 'rxjs';

import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';
import { configurationSelector } from '../selectors/cadastrapp';

import {
    SETUP,
    setConfiguration,
    loading
} from '../actions/cadastrapp';
import { getConfiguration } from '../api';

export const cadastrappSetup = (action$, {getState = () => {}}) =>
    action$.ofType(SETUP).switchMap( () => {
        // initStream loads configuration if not loaded yet
        const configuration = configurationSelector(getState());
        let initStream$ = configuration
            ? Rx.Observable.empty()
            : Rx.Observable.defer(() => getConfiguration())
                .switchMap(({ data }) => {
                    return Rx.Observable.of(setConfiguration(data));
                });
        return initStream$.concat(
            Rx.Observable.empty() // TODO: add cadastrapp layer
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

