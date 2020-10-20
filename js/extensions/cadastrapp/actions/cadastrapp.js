

export const SETUP = "CADASTRAPP:SETUP";
export const TEAR_DOWN = "CADASTRAPP:TEAR_DOWN";
export const LOADING = "CADASTRAPP:LOADING";
export const SET_CONFIGURATION = "CADASTRAPP:SET_CONFIGURATION";
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
