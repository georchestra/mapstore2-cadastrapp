import { SEARCH_TYPES, MIN_PARCELLE_ID_LENGTH } from '../constants';

export function validateReferences(items = []) {
    return items.reduce((valid, value) => valid && value.section && value.plot, true);
}

export function referenceTabValid({references = [], commune} = {}) {
    return commune && references.length > 0 && validateReferences(references);
}

/**
 * Is valid if every parcelle (Separated by comma) in the `parcelle` attribute of the object is valid. (min length)
 * @param {object} searchData contains parcelle
 */
export function idTabValid({parcelle = ""} = {}) {
    return parcelle && parcelle.split(',').reduce((valid, value = "") => valid && value.length >= MIN_PARCELLE_ID_LENGTH, true);
}

export function isSearchValid(tab, data) {
    switch (tab) {
    case SEARCH_TYPES.REFERENCE:
        return referenceTabValid(data);
    case SEARCH_TYPES.ID:
        return idTabValid(data);
    default:
        return false;
    }
}
