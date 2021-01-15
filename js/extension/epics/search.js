import Rx from 'rxjs';
import uuid from 'uuid';
import {head, trim} from 'lodash';
import { SEARCH_TYPES } from '../constants';
import { getCadastrappLayer, cadastreLayerIdParcelle } from '../selectors/cadastrapp';
import { getLayerJSONFeature } from '@mapstore/observables/wfs';
import { getParcelle, getParcelleByCompteCommunal, getProprietaire } from '../api/api';

import { workaroundDuplicatedParcelle } from '../utils/workarounds';
import { SEARCH, addPlots } from '../actions/cadastrapp';

const DELIMITER_REGEX = /[\s\;\,\n]/;
function readCSV(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function() {
            const string = reader.result;
            const parcelle = string.split(DELIMITER_REGEX).map(trim).filter(v => v).join(',');
            resolve(parcelle);
        };
        reader.onerror = function () {
            reject(reader.error.name);
        };
        reader.readAsText(file);
    });
}

function targetFromSearch(searchType, rawParams) {
    return {
        id: uuid(),
        title: searchType === SEARCH_TYPES.REFERENCE ? rawParams?.commune?.label
            : searchType === SEARCH_TYPES.ADDRESS ? rawParams?.commune?.label
                : searchType === SEARCH_TYPES.LOT ? "Lot"
                    : searchType === SEARCH_TYPES.ID ? "Id(s)"
                        : undefined
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
        return Rx.Observable.defer(() => file ? readCSV(file).then( pp => getParcelle({ parcelle: pp })) : getParcelle({parcelle}))
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
        featureTypeName: layer.name,
        typeName: layer.name, // the layer name is not used
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
            .map(parcelles => addPlots(parcelles, target ?? targetFromSearch(searchType, rawParams)));
    });
}
