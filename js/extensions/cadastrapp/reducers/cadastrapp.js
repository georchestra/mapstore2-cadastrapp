import { set, arrayUpsert, compose} from '@mapstore/utils/ImmutableUtils';
import {find} from 'lodash';
import {
    LOADING,
    ADD_PLOTS,
    ADD_PLOT_SELECTION,
    REMOVE_PLOT_SELECTION,
    SET_ACTIVE_PLOT_SELECTION,
    SET_CONFIGURATION,
    TOGGLE_SELECTION,
    TOGGLE_SEARCH
} from '../actions/cadastrapp';

const EMPTY_PLOT_SELECTION = { data: [], selected: [] };

/**
 * Holds the state of cadastrapp.
 * The shape of the state is the following:
 * ```
 * {
 *     loading: true | false // general loading flag
 *     loadingFlags: {} // object that contain loading flag, for various parts of the application.
 *     searchType: undefined // one of constant.SEARCH_TOOLS
 *     selectionType: undefined // one of constant.SELECTION_TYPE
 *     plots: [{  // an entry for each tab of the plot selection
 *          data: [{parcelle: "12345", ...}] // data of the tab
 *          selected: [parcelle1, parcelle2]
 *     }],
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
export default function cadastrapp(state = {
    plots: []
}, action) {
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
    case TOGGLE_SELECTION: {
        const {selectionType} = action;
        // if the current selection button is clicked, it turns off selection
        return set("selectionType", selectionType, state);
    }
    case TOGGLE_SEARCH: {
        const { searchType } = action;
        // if the current search button is clicked, it closes the search section
        return set("searchType", searchType, state);
    }
    case ADD_PLOTS: {
        const { plots } = action;
        const {activePlotSelection = 0 } = state;
        // get the current selection or create a new one if it not exists.
        let currentSelection = state?.plots?.[activePlotSelection] ?? EMPTY_PLOT_SELECTION;
        // add every plot received and toggle selection if exist
        plots.map(({ parcelle, ...other}) => {
            // if exists, toggle selection
            if (currentSelection.data[parcelle]) {
                const isSelectedIndex = currentSelection.selected.indexOf(parcelle);
                let selected = currentSelection.selected;
                if (isSelectedIndex >= 0) {
                    selected = selected.filter(v => v === parcelle);
                } else {
                    selected = [...selected, parcelle];
                }
                currentSelection = {
                    ...currentSelection,
                    selected
                };
            }
            // update/insert the value at the en
            currentSelection = arrayUpsert(`data`, { parcelle, ...other }, {parcelle}, currentSelection);
        });
        // update with new values the state
        return set(`plots[${activePlotSelection}]`, currentSelection, state);
    }
    case ADD_PLOT_SELECTION: {
        return set(`plots`, [...state.plots, EMPTY_PLOT_SELECTION], state);
    }
    case REMOVE_PLOT_SELECTION: {
        const active = action.active ?? state.activePlotSelection;
        const newPlots = [...state.plots.filter((_, i) => i !== active)];
        return compose(
            set(`plots`, newPlots),
            set(`activePlotSelection`, Math.max(state.activePlotSelection - 1, 0))
        )(state);
    }
    case SET_ACTIVE_PLOT_SELECTION: {
        return set('activePlotSelection', action.active, state);
    }
    default:
        return state;
    }
}
