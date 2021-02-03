import { set, arrayUpsert, compose} from '@mapstore/utils/ImmutableUtils';
import { get, find, uniq, isNil, isObject, isNumber, findIndex } from 'lodash';
import {
    LOADING,
    ADD_PLOTS,
    REMOVE_PLOTS,
    ADD_PLOT_SELECTION,
    REMOVE_PLOT_SELECTION,
    SET_ACTIVE_PLOT_SELECTION,
    SELECT_PLOTS,
    DESELECT_PLOTS,
    SET_CONFIGURATION,
    TOGGLE_SELECTION,
    TOGGLE_SEARCH,
    TEAR_DOWN,
    SET_LAYER_STYLE,
    SET_STYLES,
    SHOW_OWNERS,
    CLEAR_OWNERS,
    SHOW_LANDED_PROPERTIES_INFORMATION,
    INFORMATION_UPDATE,
    INFORMATION_CLEAR,
    SAVE_BUBBLE_INFO, SETUP
} from '../actions/cadastrapp';

import {LAYER_STYLES} from '../constants';

/**
 * Toggles selection of one parcelle, if present
 * @param {object} currentSelection current selection object
 * @param {string} parcelle the Id of the parcelle
 */
function toggleSelection(currentSelection, parcelle) {
    if (find(currentSelection.data, {parcelle})) {
        const isSelectedIndex = currentSelection.selected.indexOf(parcelle);
        let selected = currentSelection.selected;
        if (isSelectedIndex >= 0) {
            selected = selected.filter(v => v !== parcelle);
        } else {
            selected = [...selected, parcelle];
        }
        return {
            ...currentSelection,
            selected
        };
    }
    return currentSelection;
}

const EMPTY_PLOT_SELECTION = { data: [], selected: [] };

const DEFAULT_STATE = {
    plots: [],
    styles: LAYER_STYLES
};

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
export default function cadastrapp(state = DEFAULT_STATE, action) {
    const type = action.type;
    switch (type) {
    case SETUP:
        return set('pluginCfg', action.cfg, state);
    case SET_CONFIGURATION:
        return set('configuration', action.configuration, state);
    case LOADING: {
        let newValue = action.value;
        if (action.mode === 'count') {
            const oldValue = get(state, `loadFlags.${action.name}`) ?? 0;
            newValue = isNumber(newValue)
                ? newValue // set with passed value if number
                : newValue
                    ? oldValue + 1 // increment if true
                    : Math.max(oldValue - 1, 0); // decrement if false
        }
        // anyway sets loading to true
        return set(action.name === "loading" ? "loading" : `loadFlags.${action.name}`, newValue, state);
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
        const { plots, target, activate = true } = action;
        const {activePlotSelection = 0 } = state;
        let targetPlotSelection = activePlotSelection;
        let newState = state;
        if (!isNil(target)) {
            const targetIndex = isObject(target) ? findIndex(state.plots, {id: target.id}) : target;
            // create
            if (targetIndex < 0) {
                newState = set(`plots`, [...state.plots, { ...EMPTY_PLOT_SELECTION, ...target }], state);
                targetPlotSelection = newState.plots.length - 1;
            } else {
                newState = set(`plots[${targetIndex}]`, {...state.plots[targetIndex], ...target});
                targetPlotSelection = targetIndex;
            }
        }
        if (activate) {
            newState = set(`activePlotSelection`, targetPlotSelection, newState);
        }
        // get the current selection or create a new one if it not exists.
        let currentSelection = newState?.plots?.[targetPlotSelection] ?? EMPTY_PLOT_SELECTION;
        // add every plot received and toggle selection if exist
        plots.map(({ parcelle, ...other}) => {
            // if exists, toggle selection
            currentSelection = toggleSelection(currentSelection, parcelle);
            // update/insert the value at the en
            currentSelection = arrayUpsert(`data`, { parcelle, ...other }, {parcelle}, currentSelection);
        });
        // update with new values the state
        return set(`plots[${targetPlotSelection}]`, currentSelection, newState);
    }
    case REMOVE_PLOTS: {
        const { parcelles = []} = action;
        const {activePlotSelection = 0 } = state;
        // get the current selection or create a new one if it not exists.
        let currentSelection = state?.plots?.[activePlotSelection] ?? EMPTY_PLOT_SELECTION;
        currentSelection = {
            ...currentSelection,
            data: currentSelection.data.filter(({ parcelle }) => !parcelles.includes(parcelle)),
            selected: currentSelection.selected.filter(parcelle => !parcelles.includes(parcelle))
        };
        // update with new values the state
        return set(`plots[${activePlotSelection}]`, currentSelection, state);
    }
    case SELECT_PLOTS:
    case DESELECT_PLOTS: {
        const { activePlotSelection = 0 } = state;
        let currentSelection = state?.plots?.[activePlotSelection] ?? EMPTY_PLOT_SELECTION;
        const {plots = []} = action;
        const parcelles = plots.map(({ parcelle }) => parcelle);
        const selected = action.type === SELECT_PLOTS
            ? uniq([...(currentSelection.selected || []), ...parcelles])
            : (currentSelection.selected || []).filter(id => !parcelles.includes(id));
        currentSelection = {
            ...currentSelection,
            selected
        };
        return set(`plots[${activePlotSelection}]`, currentSelection, state);
    }
    case ADD_PLOT_SELECTION: {
        const {plot = {}} = action;
        return set(`plots`, [...state.plots, { ...EMPTY_PLOT_SELECTION, ...plot}], state);
    }
    case REMOVE_PLOT_SELECTION: {
        const active = action.active ?? state.activePlotSelection;
        const newPlots = [...state.plots.filter((_, i) => i !== active)];
        return compose(
            set(`plots`, newPlots),
            set(`activePlotSelection`, Math.max(state.activePlotSelection - 1, 0))
        )(state);
    }
    case TEAR_DOWN: {
        return DEFAULT_STATE;
    }
    case SET_ACTIVE_PLOT_SELECTION: {
        return set('activePlotSelection', action.active, state);
    }
    case SET_LAYER_STYLE: {
        return set(`styles.${action.styleType}`, action.value, state);
    }
    case SET_STYLES: {
        return set('styles', action.styles, state);
    }
    case SHOW_OWNERS: {
        return compose(
            set('owners.data', action.owners),
            set('owners.show', true)
        )(state);
    }
    case CLEAR_OWNERS: {
        return set('owners', undefined, state);
    }
    case SHOW_LANDED_PROPERTIES_INFORMATION: {
        return set('landedProperty.parcelle', action.parcelle, state);
    }
    case INFORMATION_UPDATE: {
        return set(
            `informationData["${action.parcelle}"]${action.path ? '.' + action.path : ''}`, action.data, state
        );
    }
    case INFORMATION_CLEAR: {
        return set(
            `informationData`, undefined, state
        );
    }
    case SAVE_BUBBLE_INFO: {
        return set('infoBulle', action.data, state);
    }
    default:
        return state;
    }
}
