import axios from '@mapstore/libs/ajax';
import { castArray, isArray } from 'lodash';
let baseURL = '/cadastrapp';

export function setBaseURL(url) {
    baseURL = url;
}

/**
 * Utility function to support requests like GET `url.com/path?arg=value1&1arg=value2` or equivalent for POST in x-www-form-urlencoded.
 * Axios by default create arguments like arg[]=value1,value2. when passing arrays to the params object. (See axios doc for details)
 * This convert params object into URLSearchParams and append the parameters accordingly. If arrays, they will be appended with the same name.
 * @param {object} args params for the request. If array, it append each element to the param list with the same name
 */
function toURLParams(args) {
    const params = new URLSearchParams();
    Object.keys(args)
        .filter(k => !!args[k])
        .forEach(k =>
            isArray(args[k])
                ? args[k].forEach(v => params.append(k, v))
                : params.append(k, args[k])
        );
    return params;
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
    parcelle, // id of the parcelle
    cgocommune, // od of commune
    dnupla, // address details
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
 * Get Parcelle(s) from the getParcelle service.
 * @param {string|string[]} params.comptecommunal array of comptecommunal to add
 */
export function getParcelleByCompteCommunal({
    comptecommunal
}) {
    const params = new URLSearchParams();
    castArray(comptecommunal).forEach(v => params.append('comptecommunal', v));
    return axios.post(`${baseURL}/services/getParcelle`, params ).then(({ data }) => data);
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

export function getVoie({ cgocommune, dvoilib }) {
    return axios.get(`${baseURL}/services/getVoie`, { params: { cgocommune, dvoilib  } }).then(({ data }) => data);
}
/**
 *
 * @param {object} params
 * @param {string} params.dnupro Proprietaire ID
 * @param {string} params.ddenom Proprietaire name (text search)
 * @param {boolean} params.birthsearch if true, uses the dnupro, otherwise ddnom.
 * @param {number} params.details details level.
 * @returns The object returned depends on the `details` param
 *  - No details: `{app_nom_usage, app_nom_naissance }`
 *  - `details=1`  `[{"app_nom_usage": "...", "app_nom_naissance":"...","dlign3":"...","dlign4":"...","dlign5":"","dlign6":"","dldnss":"","jdatnss":"","ccodro_lib":"PROPRIETAIRE","comptecommunal":"123456"}]`
 *  - `details=2`  `[{"comptecommunal":"123456*7890","app_nom_usage":"the name"}]`
 */
export function getProprietaire({ cgocommune, ddenom, dnupro, birthsearch, details }) {
    const args = { cgocommune, ddenom, dnupro, birthsearch, details };
    const params = toURLParams(args);
    return axios.get(`${baseURL}/services/getProprietaire`, { params }).then(({ data }) => data);
}


// draft - not used. Replaced with local parsing
export function fromParcellesFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return axios.post(`${baseURL}/services/fromParcellesFile`, formData, config).then(({ data }) => data?.data);
}
