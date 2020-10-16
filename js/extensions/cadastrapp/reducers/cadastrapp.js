import { set } from '@mapstore/utils/ImmutableUtils';

import {
    SET_CONFIGURATION,
    LOADING
} from '../actions/cadastrapp';



/**
 * Holds the state of cadastrapp.
 * The shape of the state is the following:
 * ```
 * {
 *     loading: true | false // general loading flag
 *     loadingFlags: {} // object that contain loading flag, for various parts of the application.
 *     configuration: { // the configuration from server. e.g.
 *        cadastreLayerIdParcelle: "geo_parcelle"
 *        cadastreWFSLayerName: "qgis:cadastrapp_parcelle"
 *        cadastreWFSURL: "https://domain.org/geoserver/wfs"
 *        cadastreWMSLayerName: "qgis:cadastrapp_parcelle"
 *        cadastreWMSURL: "https://domain.org/geoserver/wms"
 *        cnil1RoleName: "ROLE_EL_APPLIS_CAD_CNIL1"
 *        cnil2RoleName: "ROLE_EL_APPLIS_CAD_CNIL2"
 *        dateValiditeEDIGEO: "01/01/2018"
 *        dateValiditeMajic: "01/01/2018"
 *        maxRequest: "8"
 *        minNbCharForSearch: "3"
 *        minParacelleIdLength: "14"
 *        organisme: "Un service fourni par "
 *        pdfbasemapthumbnails: [{,…}, {,…}]
 *        pdfbasemaptitles: [{value: "Cadastre", key: "pdf.baseMap.0.title"},…]
 *        uFWFSLayerName: "qgis:cadastrapp_unite_fonciere"
 *        uFWFSURL: "https://domain.org/geoserver/wfs"
 *     }
 * }
 * ```
 *
 * @param {object} state the application state
 * @param {object} action a redux action
 */
export default function cadastrapp(state = {}, action) {
    const type = action.type;
    switch (type) {
    case SET_CONFIGURATION:
        return set('configuration', action.configuration, state);
    case LOADING: {
        // anyway sets loading to true
        return set(action.name === "loading" ? "loading" : `loadFlags.${action.name}`, action.value, set(
            "loading", action.value, state
        ));
    }
    default:
        return state;
    }
}
