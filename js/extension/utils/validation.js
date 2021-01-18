import { SEARCH_TYPES, MIN_PARCELLE_ID_LENGTH } from '../constants';

export function validateReferences(items = []) {
    return items.reduce((valid, value) => valid && value.section && value.plot, true);
}

export function referenceTabValid({references = [], commune} = {}) {
    return commune && references.length > 0 && validateReferences(references);
}

function validateParcelleList(parcelle = "" ) {
    return parcelle.split(',').reduce((valid, value = "") => valid && value.length >= MIN_PARCELLE_ID_LENGTH, true);
}
/**
 * Is valid if every parcelle (Separated by comma) in the `parcelle` attribute of the object is valid. (min length)
 * @param {object} searchData contains parcelle
 */
export function idTabValid({parcelle = ""} = {}) {
    return parcelle && validateParcelleList(parcelle);
}

export function addressTabValid({ commune, road} = {}) {
    return commune && road;
}
/**
 * Is valid when parcelle is valid
 * @param {object} param0 parcelle or file atributes
 */
export function lotTabValid({parcelle, file} = {}) {
    return parcelle && validateParcelleList(parcelle) || !!file;
}

export function userTabValid({ proprietaire, commune} = {}) {
    return proprietaire && commune; // proprietaire can be a string or an object.
}

/**
 * Valid if it contains at least commune and a not empty string for owner id (dnupro)
 */
export function ownerIdTabValid({ commune, dnupro = []} = {}) {
    return commune && dnupro.filter(v => v).length > 0;
}

/**
 * The form requires the file to be present
 */
export function ownerLotTabValid({file} = {}) {
    return !!file;
}

export function isSearchValid(tab, data) {
    switch (tab) {
    case SEARCH_TYPES.REFERENCE:
        return referenceTabValid(data);
    case SEARCH_TYPES.ID:
        return idTabValid(data);
    case SEARCH_TYPES.LOT:
        return lotTabValid(data);
    case SEARCH_TYPES.ADDRESS:
        return addressTabValid(data);
    case SEARCH_TYPES.USER:
        return userTabValid(data);
    case SEARCH_TYPES.OWNER_ID:
        return ownerIdTabValid(data);
    case SEARCH_TYPES.OWNER_LOT:
        return ownerLotTabValid(data);
    default:
        return false;
    }
}
