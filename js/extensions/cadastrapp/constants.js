
/**
 * Identifier of mapstore layer ID for  cadastrapp
 */
export const CADASTRAPP_RASTER_LAYER_ID = "__CADASTRAPP_VECTOR_LAYER__";
export const CADASTRAPP_VECTOR_LAYER_ID = "__CADASTRAPP_RASTER_LAYER__";
// owner for tools like additional layers and draw support
export const CADASTRAPP_OWNER = "CADASTRAPP";
/**
 * Name of the control in controls reducer to get the enabled property
 */
export const CONTROL_NAME = 'cadastrapp';

export const SELECTION_TYPES = {
    POINT: "POINT",
    LINE_STRING: "LINE_STRING",
    POLYGON: "POLYGON",
    LANDED_PROPERTY: "LANDED_PROPERTY"
};

/**
 * type of the search tools
 */
export const SEARCH_TOOLS = {
    PLOT: "PLOT",
    OWNER: "OWNER",
    COOWNER: "COOWNER"
};
