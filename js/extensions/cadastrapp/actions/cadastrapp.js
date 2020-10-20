

export const SETUP = "CADASTRAPP:SETUP";
export const TEAR_DOWN = "CADASTRAPP:TEAR_DOWN";
export const LOADING = "CADASTRAPP:LOADING";
export const SET_CONFIGURATION = "CADASTRAPP:SET_CONFIGURATION";
export const TOGGLE_SELECTION = "CADASTRAPP:TOGGLE_SELECTION";
export const TOGGLE_SEARCH = "CADASTRAPP:TOGGLE_SEARCH";
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

