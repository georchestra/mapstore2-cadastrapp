import { CADASTRAPP_LAYER_ID } from '../constants';
import { getLayerFromId} from '@mapstore/selectors/layers';

/**
 * Gets the configuration loaded from cadastrapp API
 * @param {object} state
 */
export function configurationSelector(state) { return state?.cadastrapp.configuration;}

/**
 * loads from the configuration the property name to use as id for parcelle.
 * @param {object} state
 */
export function cadastreLayerIdParcelle(state) {
    const conf = configurationSelector(state);
    return conf?.cadastreLayerIdParcelle;
}
/**
 * gets the whole cadastrapp layer object
 * @param {object} state
 */
export function getCadastrappLayer(state) { return getLayerFromId(state, CADASTRAPP_LAYER_ID); }
/**
 * gets the current active selection tool for map (id)
 * @param {object} state
 */
export function currentSelectionToolSelector(state) { return state?.cadastrapp.selectionType; }

/**
 * gets the current active search form id.
 * @param {object} state
 */
export function currentSearchToolSelector(state) { return state?.cadastrapp.searchType; }

export function activeSelectionTabIndexSelectors(state) { return state?.cadastrapp.activePlotSelection || 0; }

/**
 * Gets the data of plot selection from the state
 * @param {object} state
 */
export function plotDataSelector(state) {
    const selection = state?.cadastrapp?.plots;
    if (!selection) {
        return [];
    }
    return selection.map(({data}) => data); // transform in array of array
}
