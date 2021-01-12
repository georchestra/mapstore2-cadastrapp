import Rx from 'rxjs';
import {head} from 'lodash';
import { SEARCH_TYPES } from '../constants';
import { getCadastrappLayer, cadastreLayerIdParcelle } from '../selectors/cadastrapp';
import { getLayerJSONFeature } from '@mapstore/observables/wfs';
import { getParcelle } from '../api';

import { workaroundDuplicatedParcelle } from '../utils/workarounds';
import { SEARCH, addPlots } from '../actions/cadastrapp';

function toGetParcelleParams({ searchType, rawParams }) {
    switch (searchType) {
    case SEARCH_TYPES.REFERENCE:
        const {references = []} = rawParams;
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
    case SEARCH_TYPES.ID: {
        const {parcelle = ""} = rawParams;
        // comma separated means multiple values
        return parcelle.split(',').map(p => ({parcelle: p}));
    }
    default:
        break;
    }
    return [];
}
function createRequest({parcelle}, getState) { // note: extract `parcelle` attribute from object.
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
    return action$.ofType(SEARCH).switchMap(({searchType, rawParams}) => {
        const requestsParams = toGetParcelleParams({searchType, rawParams});
        return Rx.Observable.merge(
            ...requestsParams
                .map(params =>
                    Rx.Observable.defer( () => getParcelle(params))
                        .switchMap(parcelles => Rx.Observable.from(parcelles)) // transform array of results into single flows
                        .flatMap(parcelle => // for each parcelle,
                            createRequest(parcelle, store.getState) // create a request for the releated feature
                                .map(({ features = []} = {}) => { // add the feature to the parcelle object
                                    const parcelleProperty = cadastreLayerIdParcelle(store.getState());
                                    return {
                                        ...parcelle,
                                        feature: head(features.filter(workaroundDuplicatedParcelle(parcelleProperty))) // removes duplicates
                                    };
                                })
                        )
                )
        )
            .reduce((acc, next) => [...acc, next], [])
            .map(parcelles => addPlots(parcelles, {id: "references", title: rawParams?.commune?.label}));
    });
}
