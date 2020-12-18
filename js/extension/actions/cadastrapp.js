

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
 * @props plots the parcelles to add.
 */
export const addPlots = (plots) => ({
    type: ADD_PLOTS,
    plots
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
 */
export const addPlotSelection = () => ({
    type: ADD_PLOT_SELECTION
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
