import { LAYER_STYLES } from '../constants';

export const SETUP = "CADASTRAPP:SETUP";
export const TEAR_DOWN = "CADASTRAPP:TEAR_DOWN";
export const LOADING = "CADASTRAPP:LOADING";
export const SET_CONFIGURATION = "CADASTRAPP:SET_CONFIGURATION";
export const TOGGLE_SELECTION = "CADASTRAPP:TOGGLE_SELECTION";
export const TOGGLE_SEARCH = "CADASTRAPP:TOGGLE_SEARCH";
export const ADD_PLOTS = "CADASTRAPP:ADD_PLOTS";
export const REMOVE_PLOTS = "CADASTRAPP:REMOVE_PLOTS";
export const SET_ACTIVE_PLOT_SELECTION = "CADASTRAPP:SET_ACTIVE_PLOT_SELECTION";
export const ADD_PLOT_SELECTION = "CADASTRAPP:ADD_PLOT_SELECTION";
export const REMOVE_PLOT_SELECTION = "CADASTRAPP:REMOVE_PLOT_SELECTION";
export const SELECT_PLOTS = "CADASTRAPP:SELECT_PLOTS";
export const DESELECT_PLOTS = "CADASTRAPP:DESELECT_PLOTS";
export const ZOOM_TO_SELECTION = "CADASTRAPP:ZOOM_TO_SELECTION";

export const SET_LAYER_STYLE = "CADASTRAPP:SET_LAYER_STYLE";
export const SET_STYLES = "CADASTRAPP:SET_STYLES";

export const OPEN_LP = "CADASTRAPP:OPEN_LANDRY_PROPERTY";

export const SEARCH = "CADASTRAPP:SEARCH";

/**
 * Set the style of highlight
 * @param {string} styleType the type of the style, one of selected/default
 * @param {object} value the style object ({color, fillColor, ...})
 */
export const setLayerStyle = (styleType, value) => ({
    type: SET_LAYER_STYLE,
    styleType,
    value
});

/**
 * Resets all the styles for feature highlight on map.
 * @param {object} styles and object with `default` and `selected` entries for styling features on map.
 */
export const setLayerStyles = (styles = LAYER_STYLES) => ({
    type: SET_STYLES,
    styles
});

/**
 * Triggered on cadastrapp activation
 */
export const setUp = () => ({
    type: SETUP
});

export const loading = (value, name) => ({
    type: LOADING,
    value,
    name
});
/**
 * Loads the configuration in the state
 * @argument {object} configuration
 */
export const setConfiguration = (configuration) => ({
    type: SET_CONFIGURATION,
    configuration
});
/**
 * Triggered when cadastrapp is closed
 */
export const tearDown = () => ({
    type: TEAR_DOWN
});

/**
 * Toggles map selection in one of the modes available
 * @param {string} selectionType type of selection (constants.SELECTION_TYPES)
 */
export const toggleSelectionTool = (selectionType) => ({
    type: TOGGLE_SELECTION,
    selectionType
});

/**
 * Toggles map selection in one of the modes available
 * @param {string} searchType type of search (constants.SEARCH_TOOLS)
 */
export const toggleSearchTool = (searchType) => ({
    type: TOGGLE_SEARCH,
    searchType
});

/**
 * Insert the new plots in the current selection.
 * If they exist, they will be selected.
 * @prop {object[]} plots the parcelles to add
 * @prop {object|number} [target] if present is used to determine the selection where to add the plots.
 * - if object, it uses the 'id' property to determine the target. If not present, is created, otherwise overridden.
 * - if number, is the index in the array.
 * - if not present, it will add the plots to the current active tab.
 */
export const addPlots = (plots, target) => ({
    type: ADD_PLOTS,
    plots,
    target
});

/**
 * Remove the plots from the current selection
 * @prop {string[]}plots the parcelles to remove.
 */
export const removePlots = (parcelles) => ({
    type: REMOVE_PLOTS,
    parcelles
});


/**
 * Add a tab to the selections
 * @param {object} plot initial data
 */
export const addPlotSelection = (plot) => ({
    type: ADD_PLOT_SELECTION,
    plot
});
/**
 * Select the current tab of the selection
 * @param {number} active the index of the tab
 */
export const setActivePlotSelection = (active) => ({
    type: SET_ACTIVE_PLOT_SELECTION,
    active
});
/**
 * Removes a tab from the selection
 * @param {number} active the index of the tab. If not present, remove the active one
 */
export const removePlotSelection = (active) => ({
    type: REMOVE_PLOT_SELECTION,
    active
});
/**
 * Select the passed plots
 * @param {object[]} plots the plot to select
 */
export const selectPlots = (plots) => ({
    type: SELECT_PLOTS,
    plots
});
/**
 * Deselect the passed plots
 * @param {object[]} plots the plot to deselect
 */
export const deselectPlots = (plots) => ({
    type: DESELECT_PLOTS,
    plots
});

/**
 * Triggers a zoom to the current selection.
 */
export const zoomToSelection = () => ({
    type: ZOOM_TO_SELECTION
});

/**
 * Opens landry property tab
 */
export const openLP = (parcelle) => ({
    type: OPEN_LP,
    parcelle
});

/**
 * Perform a search event. The target is the plot selection to contain the results.
 * @param {string} searchType one of SEARCH_TYPES
 * @param {object} rawParams search parameters (depends on the search typ)
 */
export const search = (searchType, rawParams) => ({
    type: SEARCH,
    searchType,
    rawParams
});

