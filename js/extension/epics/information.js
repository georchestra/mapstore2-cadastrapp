import Rx from 'rxjs';
import { LOAD_INFO, updateInformation, loading, INFORMATION_CLEAR } from '../actions/cadastrapp';
import { error } from '../../../MapStore2/web/client/actions/notifications';

import { getAuthLevel } from '../selectors/cadastrapp';

import { getFic, getProprietairesByParcelles, getBatimentsByParcelle } from '../api/api';

export const loadParcelleInformationData = (action$, store) => {
    return action$.ofType(LOAD_INFO).switchMap(({parcelles}) => {
        const { isCNIL1, isCNIL2 } = getAuthLevel(store.getState());
        return Rx.Observable.from(parcelles).flatMap(
            parcelle => Rx.Observable.merge(
                Rx.Observable.defer(() => getFic({ parcelle, onglet: 0 }).then(values => values && values[0])).map(data => updateInformation(parcelle, 'fiuc', data)),
                Rx.Observable.defer(() => getFic({ parcelle, onglet: 4 })).map(data => updateInformation(parcelle, 'fiucHistoryMutation', data)),
                // Owners and Co Owners reserver to CNIL1 or CNIL2
                ...(isCNIL1 || isCNIL2
                    ? [
                        Rx.Observable.defer(() => getProprietairesByParcelles({ parcelles: parcelle })).map(data => updateInformation(parcelle, 'owners', data))
                        // Rx.Observable.defer(() => getCoProprietaire({ parcelle })).map(data => updateInformation(parcelle, 'coOwners', data)) // this list is too long, using pagination iside component
                    ]
                    : []),
                // Building and subdivision fiscal, reserver to CNIL2
                ...(isCNIL2
                    ? [
                        Rx.Observable.defer(() => getBatimentsByParcelle({ parcelle: parcelle })).map(data => updateInformation(parcelle, 'letters', data)),
                        Rx.Observable.defer(() => getFic({ parcelle, onglet: 3 })).map(data => updateInformation(parcelle, 'fiscalSubDiv', data))
                    ]
                    : [])
            ).catch(() => {
                Rx.Observable.of(loading(false, `info[${parcelle}]`), error({title: "error getting information", message: `error getting information for parcelle ${parcelle}`}));
            }).concat(Rx.Observable.defer(() => {
                return Rx.Observable.of(loading(false, `info[${parcelle}]`),);
            })).startWith(loading(true, `info[${parcelle}]`))
        )
            .takeUntil(action$.ofType(INFORMATION_CLEAR)) // stop loading on close
            .concat(Rx.Observable.of(loading({}, `info`))); // clear loading object
    });
};
