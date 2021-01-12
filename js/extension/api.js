import axios from '@mapstore/libs/ajax';

let baseURL = '/cadastrapp';

export function setBaseURL(url) {
    baseURL = url;
}

/**
 * Retrieves the initial configuration for cadastrapp services
 * @returns {object} the configuration of the services containing base details of WMS/WFS services
 */
export function getConfiguration() {
    return axios.get(`${baseURL}/services/getConfiguration`).then(({data}) => data);
}

/**
 * Get Parcelle(s) from the getParcelle service.
 * @param {object} params parameters to query getParcelle service. one of
 * parcelle
 * - `cgocommune`
 * - `dnupla`
 * - `ccopre`
 * - `ccosec`
 * - `dvoilib`
 * - `dnvoiri`
 * - `dindic`
 */
export function getParcelle({
    parcelle,
    cgocommune,
    dnupla,
    ccopre,
    ccosec,
    dvoilib,
    dnvoiri,
    dindic}) {
    return axios.get(`${baseURL}/services/getParcelle`, {
        params: {
            parcelle,
            cgocommune,
            dvoilib,
            dnvoiri,
            dindic,
            dnupla,
            ccopre,
            ccosec} }).then(({data}) => data);
}

/**
 * Call the API for getCommune
 * @param {object} params `libcom` (sub-string) or `cgocommune` code
 * @returns {array} array of object like {cgocommune: "350238", libcom: "RENNES". libcom_min: "Rennes"}
 */
export function getCommune({ libcom, cgocommune }) {
    return axios.get(`${baseURL}/services/getCommune`, { params: { libcom, cgocommune } }).then(({ data }) => data);
}

/**
 * Search commune by text. Min 3 chars for results
 * @param {string} text text to search
 */
export function searchCommune(text) {
    return getCommune({libcom: text});
}

/**
 * get sections for the passed commune
 * @param {string} cgocommune the code of the commune
 */
export function getSection(cgocommune) {
    return axios.get(`${baseURL}/services/getSection`, { params: { cgocommune } }).then(({ data }) => data);
}

/**
 * Get Plot from co
 * @param {object} params `cgocommune, ccopre, ccosec`
 */
export function getDnuplaList({ cgocommune, ccopre, ccosec }) {
    return axios.get(`${baseURL}/services/getDnuplaList`, { params: { cgocommune, ccopre, ccosec } }).then(({ data }) => data);
}
