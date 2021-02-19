import Rx from 'rxjs';
import uuid from 'uuid';
import {head, trim} from 'lodash';
import { SEARCH_TYPES } from '../constants';
import { getCadastrappLayer, cadastreLayerIdParcelle } from '../selectors/cadastrapp';
import { getLayerJSONFeature } from '@mapstore/observables/wfs';
import { wrapStartStop } from '@mapstore/observables/epics';
import { error } from '@mapstore/actions/notifications';

import { getCoProprietaireList, getParcelle, getParcelleByCompteCommunal, getProprietaire } from '../api/api';

import { workaroundDuplicatedParcelle } from '../utils/workarounds';
import { SEARCH, addPlots, OWNERS_SEARCH, showOwners, loading } from '../actions/cadastrapp';
import { isValidParcelle } from '../utils/validation';

const DELIMITER_REGEX = /[\s\;\,\n]/;

/**
 * Reads specific files that contain the list of parcelle, or comptecomunal
 * @returns {Promise} a promis that emits an array of strings.
 * @param {file} file file to read
 */
function readCSV(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function() {
            const string = reader.result;
            const parcelle = string.split(DELIMITER_REGEX).map(trim).filter(v => v);
            resolve(parcelle);
        };
        reader.onerror = function () {
            reject(reader.error.name);
        };
        reader.readAsText(file);
    });
}

function getTitle(searchType, rawParams) {
    switch (searchType) {
    case SEARCH_TYPES.REFERENCE:
        return rawParams?.commune?.label;
    case SEARCH_TYPES.ADDRESS:
        return rawParams?.commune?.label;
    case SEARCH_TYPES.LOT:
        return "Lot";
    case SEARCH_TYPES.ID:
        return "Id(s)";
    case SEARCH_TYPES.OWNER_ID:
        return rawParams?.commune?.label;
    case SEARCH_TYPES.COMPTE_COMMUNAL:
        return rawParams?.comptecommunal;
    case SEARCH_TYPES.OWNER_LOT:
        return "By file";
    default:
        return null;

    }
}
function targetFromSearch(searchType, rawParams) {
    let title = getTitle(searchType, rawParams);
    return {
        id: uuid(),
        title
    };
}

function parseReferenceParams(rawParams) {
    const { references = [] } = rawParams;
    return references.map(({ plot, section }) => {
        const {
            cgocommune,
            ccopre,
            ccosec
        } = section;
        const { dnupla } = plot;
        return {
            dnupla,
            cgocommune,
            ccopre,
            ccosec
        };
    });
}
function searchParcelles({ searchType, rawParams }) {
    switch (searchType) {
    case SEARCH_TYPES.REFERENCE:
        const requests = parseReferenceParams(rawParams);
        return Rx.Observable.merge(...requests.map(params =>
            Rx.Observable.defer(() => getParcelle(params))
                .switchMap(parcelles => Rx.Observable.from(parcelles)))); // transform array of results into single flows
    case SEARCH_TYPES.ID: {
        const {parcelle = ""} = rawParams;
        // comma separated means multiple values, getParcelle supports also comma separated list of parcelle
        return Rx.Observable.defer(() => getParcelle({ parcelle }))
            .switchMap(parcelles => Rx.Observable.from(parcelles));
    }
    case SEARCH_TYPES.LOT: {
        const {file, parcelle}  = rawParams;
        return Rx.Observable.defer(() => file ? readCSV(file).then( pp => getParcelle({ parcelle: pp.join(',') })) : getParcelle({parcelle}))
            .switchMap(parcelles => Rx.Observable.from(parcelles));
    }
    case SEARCH_TYPES.ADDRESS: {
        const { commune, road, dnvoiri, dindic } = rawParams;
        const { cgocommune } = commune;
        const { dvoilib } = road;
        return Rx.Observable.defer(() => getParcelle({ dnvoiri, dindic, cgocommune, dvoilib }))
            .switchMap(parcelles => Rx.Observable.from(parcelles));
    }
    case SEARCH_TYPES.USER: {
        const { commune, proprietaire, birthsearch } = rawParams;
        // ddenom birthsearch=true
        const { value: ddenom } = proprietaire;
        const { cgocommune } = commune;
        return Rx.Observable.defer(() => getProprietaire({ ddenom, birthsearch, cgocommune, details: 2}))
            // generically N proprietaries (usually 1)
            .switchMap(data =>
                Rx.Observable.defer(() => getParcelleByCompteCommunal({ comptecommunal: data.map(({ comptecommunal }) => comptecommunal) }))
                    .switchMap(parcelles => Rx.Observable.from(parcelles))
            );
    }
    case SEARCH_TYPES.OWNER_ID: {
        const { commune, dnupro } = rawParams;
        const { cgocommune } = commune;
        return Rx.Observable.defer(() => getProprietaire({ dnupro, cgocommune, details: 2 }))
            // generically N proprietaries (usually 1)
            .switchMap(data =>
                Rx.Observable.defer(() => getParcelleByCompteCommunal({ comptecommunal: data.map(({ comptecommunal }) => comptecommunal) }))
                    .switchMap(parcelles => Rx.Observable.from(parcelles))
            );
    }
    case SEARCH_TYPES.OWNER_LOT: {
        const { file } = rawParams;
        return Rx.Observable.defer(() => readCSV(file).then(comptecommunal => getParcelleByCompteCommunal({ comptecommunal })) )
            .switchMap(parcelles => Rx.Observable.from(parcelles));
    }
    case SEARCH_TYPES.COMPTE_COMMUNAL: {
        const { comptecommunal } = rawParams;

        return Rx.Observable.defer(() => getParcelleByCompteCommunal({ comptecommunal }))
            .switchMap(parcelles => Rx.Observable.from(parcelles));
    }
    case SEARCH_TYPES.COOWNER: {
        const { commune, proprietaire = {}, parcelle, comptecommunal } = rawParams;
        const { value: ddenom } = proprietaire;
        const { cgocommune } = commune;
        // if parcelle is defined, it looks like normal parcelleId search.
        if (parcelle && isValidParcelle(parcelle)) {
            return Rx.Observable.defer(() => getParcelle({ parcelle })).switchMap(parcelles => Rx.Observable.from(parcelles));
        }
        return Rx.Observable.defer(() => getCoProprietaireList({ cgocommune, ddenom, comptecommunal, details: 1 }))
            .switchMap((proprietaireList = []) =>
                getParcelleByCompteCommunal({ comptecommunal: proprietaireList.map(({ comptecommunal: cc }) => cc) }) // extract comptecommunal from CoProprietaireList
            )
            .switchMap(parcelles => Rx.Observable.from(parcelles));
    }
    default:
        break;
    }
    return [];
}
function getParcelleFeature({parcelle}, getState) { // note: extract `parcelle` attribute from object.
    const layer = getCadastrappLayer(getState());
    const parcelleProperty = cadastreLayerIdParcelle(getState());
    return getLayerJSONFeature(layer, {
        filterType: "OGC", // CQL doesn't support LineString yet
        featureTypeName: layer?.search?.name ?? layer?.name,
        typeName: layer?.search?.name ?? layer?.name, // the layer name is not used
        ogcVersion: '1.1.0'
    }, {cqlFilter: `${parcelleProperty} = '${parcelle}'`});
}


export function cadastrappSearch(action$, store) {
    return action$.ofType(SEARCH).switchMap(({searchType, rawParams, target}) => {
        return searchParcelles({searchType, rawParams})
            .flatMap(parcelle => // for each parcelle,
                getParcelleFeature(parcelle, store.getState) // create a request for the releated feature
                    .map(({ features = []} = {}) => { // add the feature to the parcelle object
                        const parcelleProperty = cadastreLayerIdParcelle(store.getState());
                        return {
                            ...parcelle,
                            feature: head(features.filter(workaroundDuplicatedParcelle(parcelleProperty))) // removes duplicates
                        };
                    })
            )
            .reduce((acc, next) => [...acc, next], [])
            .map(parcelles => addPlots(parcelles, target ?? targetFromSearch(searchType, rawParams)))
            .let(wrapStartStop(
                [loading(true, "plotSelection", "count"), loading(true, 'search')],
                [loading(false, "plotSelection", "count"),  loading(false, 'search')],
                e => Rx.Observable.of(error({ title: "error during search", message: e.message ?? "unknown error"}))
            ));
    });
}

/**
 * Triggers a search of owners to show the list of results.
 * @param {*} action$
 */
export function cadastrappOwnersSearch(action$) {
    return action$.ofType(OWNERS_SEARCH).switchMap(({searchType, rawParams}) => {
        const { commune, proprietaire, birthsearch, comptecommunal } = rawParams; // proprietaire in this case is a string
        // ddenom birthsearch=true
        const { cgocommune } = commune;
        return Rx.Observable.defer(() => searchType === SEARCH_TYPES.USER
            ? getProprietaire({ ddenom: proprietaire, birthsearch, cgocommune, details: 2 })
            : getCoProprietaireList({ ddenom: proprietaire, cgocommune, comptecommunal, details: 1})
        )
            .switchMap( owners => Rx.Observable.of(showOwners(owners)))
            .let(wrapStartStop(loading(true, 'search'), loading(false, 'search')));
    });
}
