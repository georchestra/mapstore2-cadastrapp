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
    dindic,
    unitefonciere
}) {
    return axios.get(`${baseURL}/services/getParcelle`, {
        params: {
            parcelle,
            cgocommune,
            dvoilib,
            dnvoiri,
            dindic,
            dnupla,
            ccopre,
            ccosec,
            unitefonciere
        } }).then(({data}) => data);
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
export function getProprietaire({ cgocommune, ddenom, dnupro, birthsearch, details, comptecommunal }) {
    const args = { cgocommune, ddenom, dnupro, birthsearch, details, comptecommunal };
    const params = toURLParams(args);
    return axios.get(`${baseURL}/services/getProprietaire`, { params }).then(({ data }) => data);
}

/**
 * Get the Co proprietaire list from the passed parameter
 * @param {params} param0 params
 * @returns an array of proprietaire, depending on detail (as well as `getProprietaire`)
 */
export function getCoProprietaireList({ comptecommunal, cgocommune, ddenom, details }) {
    const params = { comptecommunal, cgocommune, ddenom, details };
    return axios.get(`${baseURL}/services/getCoProprietaireList`, {params}).then(({ data }) => data);
}

// Unite Fonciere
/**
 * getInfoUniteFonciere
 * @param {string} params.parcelle parcelle
 * @returns object like:
 * ```
 * {
 *   comptecommunal: "12345*2345"
 *   dcntpa_sum: 1234
 *   sigcal_sum: 1243
 *   sigcalb_sum: 1234
 *   uf: 1234
 * }
```
 */
export function getInfoUniteFonciere({ parcelle }) {
    const params = { parcelle };
    return axios.get(`${baseURL}/services/getInfoUniteFonciere`, { params }).then(({ data }) => data);
}


// Information Form
/**
 *
 * @param {string} params.parcelle
 * @param {number} params.onglet if 0, get FIUC data, if 4, get FIUC history mutation. if 3, get fiscal subdivision
 * @returns {object[]} array of object, structure depends on `onglet`
 * For onglet=0
 * ```
 * {
 *     cconvo: "RUE"
 *     ccopre: ""
 *     ccoriv: "1234"
 *     ccosec: "AB"
 *     cgocommune: "1234"
 *     dcntpa: 1234567
 *     dindic: ""
 *     dnupla: "123"
 *     dnvoiri: "    "
 *     dvoilib: "NAME"
 *     gparbat: "1"
 *     gurbpa: " "
 *     libcom: "RENNES"
 *     surfc: 12345
 * }
 * ```
 * For onglet=3
 * ```
 *  {ccosub: "", dcntsf: 12345, nat_culture: "Sol, Sols", drcsub: 0}
 * ```
 * For onglet=4
 * ```
 * {
 *   ccocomm: "123"
 *   ccoprem: null
 *   ccosecm: "AB"
 *   dnuplam: "1234"
 *   jdatat: "01/01/1987"
 *   type_filiation: "Division"
 * }
 * ```
 */
export function getFic({ parcelle, onglet}) {
    const params = { parcelle, onglet };
    return axios.get(`${baseURL}/services/getFIC`, { params }).then(({ data }) => data);
}

export function getProprietairesByParcelles({ parcelles }) {
    const params = { parcelles };
    return axios.get(`${baseURL}/services/getProprietairesByParcelles`, { params }).then(({ data }) => data);
}
/**
 * Paged list of co-owners.
 * @param {string} params.parcelle
 * @param {string} params.start
 * @param {string} params.limit
 * @returns {object} the coowner, with totalSize, like the following:
 * ```javascript
 * {
 * results: 1234, // totalSize
 * rows: [{
 *    // ...owner data
 * }]}
 * ```
 *
 */
export function getCoProprietaire({ parcelle, start = 0, limit = 99999 }) { // default values to avoid pagination (TODO:: implement pagination?)
    const params = { parcelle, start, limit };
    return axios.get(`${baseURL}/services/getCoProprietaire`, { params }).then(({ data }) => data);
}

/**
 * Gets the list of building's letters
 * @param {string} params.parcelle the parcelle
 * @returns {object[]} array of objects like `[{dnubat: "A"}, {dnubat: "B"}...]`
 */
export function getBatimentsByParcelle({ parcelle }) {
    const params = { parcelle };
    return axios.get(`${baseURL}/services/getBatimentsByParcelle`, { params }).then(({ data }) => data);
}
/**
 * Get Building info.
 * @param {string} parcelle the parcelle
 * @param {string} dnubat the building letter
 * @returns {object[]} an array of properties for each building identified by parcelle/dnubat
 * ```json
 * {
 *    annee: "2019"
 *    app_nom_naissance: null
 *    app_nom_usage: "CENTRE HOSPITALIER REGIONAL"
 *    ccoaff_lib: "Commerce"
 *    comptecommunal: "350238+00142"
 *    descr: "01"
 *    dniv: "00"
 *    dnupro: "+00142"
 *    dpor: "01001"
 *    invar: "2380080389"
 *    jannat: "0000"
 *    revcad: 8416
 * }
 * ```
 *
 */
export function getBatiments({ parcelle, dnubat }) {
    const params = { parcelle, dnubat };
    return axios.get(`${baseURL}/services/getBatiments`, { params }).then(({ data }) => data);
}
/**
 * GetHabitationDetails
 * @param {string|number} invar
 * @param {string|number} aneee
annee: 2019} param0
 */
export function getHabitationDetails({ invar, annee }) {
    const params = { invar, annee };
    return axios.get(`${baseURL}/services/getHabitationDetails`, { params }).then(({ data }) => data);
}

// DOWNLOAD (INFORMATION)

// e.g. https://georchestra.geo-solutions.it/cadastrapp/services/createBordereauParcellaire?parcelle=350238000AD0230&personaldata=0&basemapindex=0&fillcolor=81BEF7&opacity=0.51&strokecolor=111111&strokewidth=4
/**
 *
 * @param {string} params.parcelle parcelle to print
 * @param {string} params.personaldata 0 or 1, to include owners data (cnil1 or cnil2 only)
 * @param {number} params.basemapindex id of the background to use. Valid values can be derived from configuration)
 * @param {string} params.fillcolor hex of the fill color
 * @param {string} params.opacity between 0 and 1. Opacity to use for map
 * @param {string} params.strokecolor hex for the stroke color
 * @param {string} params.strokewidth size in pixels of the width of the stroke.
 *
 */
export function createBordereauParcellaire({ parcelle, personaldata, basemapindex, fillcolor, opacity, strokecolor, strokewidth}) {
    const params = { parcelle, personaldata, basemapindex, fillcolor, opacity, strokecolor, strokewidth };
    return axios.get(`${baseURL}/services/createBordereauParcellaire`, { params, responseType: 'arraybuffer' });
}
/**
 * Download the Owners
 * @param {string} params.compteCommunal code (or comma-separated list of compteCommunal codes)
 * @param {string} [params.parcelleId] optional, if not present, will export all properties.
 * @param {string} [params.exportType="on"] documented as present. Not explained anywhere else neither seems to be used. See: https://github.com/georchestra/cadastrapp/search?q=exportType
 */
export function createRelevePropriete({ compteCommunal, parcelleId, exportType = "on"}) {
    const params = { compteCommunal, parcelleId, exportType };
    return axios.get(`${baseURL}/services/createRelevePropriete`, { params, responseType: 'arraybuffer' });
}
/**
 * Download the Owners as csv
 * @param {string} params.compteCommunal code (or comma-separated list of compteCommunal codes)
 * @param {string} [params.parcelleId] optional, if not present, will export all properties.
 * @param {string} [params.exportType="on"] documented as present. Not explained anywhere else neither seems to be used. See: https://github.com/georchestra/cadastrapp/search?q=exportType
 */
export function createReleveProprieteAsCSV({ compteCommunal, parcelleId, exportType = "on" }) {
    const params = { compteCommunal, parcelleId, exportType };
    return axios.get(`${baseURL}/services/createReleveProprieteAsCSV`, { params, responseType: 'arraybuffer' });
}


/**
 * Get Parcelle(s) from the getParcelle service. Used also in plot selection.
 * @param {string|string[]} params.comptecommunal array of comptecommunal to add
 */
export function exportLotsAsCSV({
    parcelle,
    dnubat
}) {
    const params = new URLSearchParams();
    castArray(parcelle).forEach(v => params.append('parcelle', v));
    castArray(dnubat).forEach(v => params.append('dnubat', v));
    return axios.post(`${baseURL}/services/exportLotsAsCSV`, params, { responseType: 'arraybuffer' });
}

/**
 * Get Parcelle(s) from the getParcelle service.
 * @param {string|string[]} params.comptecommunal array of comptecommunal to add
 */
export function exportLotsAsPDF({
    parcelle,
    dnubat
}) {
    const params = new URLSearchParams();
    castArray(parcelle).forEach(v => params.append('parcelle', v));
    castArray(dnubat).forEach(v => params.append('dnubat', v));
    return axios.post(`${baseURL}/services/exportLotsAsPDF`, params, { responseType: 'arraybuffer' });
}

/**
 * Get bulle/popup info from the parcelle layer
 * @param {object} parcelle parcelle id of the info requested
 * @param {boolean} foncier config
 */
export function getInfoBulle(parcelle, foncier = true) {
    let params = {parcelle, ...(!foncier && {infouf: 0})};
    return axios.get(`${baseURL}/services/getInfoBulle`, {params}).then(({data}) => data);
}

// DOWNLOAD (PLOT SELECTION)
/**
 * Download parcelles as CSV
 * @param {string|string[]} params.parcelles array or comma separated list of parcelles
 */
export function exportParcellesAsCSV({
    parcelles
}) {
    const params = new URLSearchParams();
    params.append('parcelles', castArray(parcelles).join(','));
    return axios.post(`${baseURL}/services/exportParcellesAsCSV`, params, { responseType: 'arraybuffer' });
}

/**
 * Download proprietaire as CSV
 * @param {string|string[]} params.parcelles array or comma separated list of parcelles
 */
export function exportProprietaireByParcelles({
    parcelles
}) {
    const params = new URLSearchParams();
    params.append('parcelles', castArray(parcelles).join(','));
    return axios.post(`${baseURL}/services/exportProprietaireByParcelles`, params, { responseType: 'arraybuffer' });
}

/**
 * Download co-proprietaire as CSV
 * @param {string|string[]} params.parcelles array or comma separated list of parcelles
 */
export function exportCoProprietaireByParcelles({
    parcelles
}) {
    const params = new URLSearchParams();
    params.append('parcelles', castArray(parcelles).join(','));
    return axios.post(`${baseURL}/services/exportCoProprietaireByParcelles`, params, { responseType: 'arraybuffer' });
}

/**
 * Utility function. Export as csv the passed data (array (rows), of array(columns)).
 * @param {array[]} params.data rows, each row is an array of columns
 */
export function exportAsCsv({data}) {
    const params = new URLSearchParams();
    castArray(data).forEach(dd => params.append('data', castArray(dd).join(',')));
    return axios.get(`${baseURL}/services/exportAsCsv`, {params}, { responseType: 'arraybuffer' });
}

/**
 * Get proprietaires by info parcelles
 * @param commune
 * @param section
 * @param numero
 * @param ddenom
 * @return {*}
 */
export function getProprietairesByInfoParcelles({ commune, section, numero, ddenom}) {
    const params = { commune, section, numero, ddenom};
    return axios.get(`${baseURL}/services/getProprietairesByInfoParcelles`, { params }).then(({ data }) => data);
}

/**
 * Print request form API
 */

/**
 * Save the print request information
 * @param printParams
 * @return {*}
 */
export function saveInformationRequest(printParams) {
    return axios.get(`${baseURL}/services/saveInformationRequest?${printParams}`).then(({ data }) => data);
}

/**
 * Print PDF based on the request data
 * @param requestid
 * @return {*}
 */
export function printPDFRequest(requestid) {
    return axios.get(`${baseURL}/services/printPDFRequest`, { params: {requestid}, responseType: 'arraybuffer'}).then(data => data);
}

/**
 * Generate document based on the requested data
 * @param requestid
 * @return {*}
 */
export function createDemandeFromObj(requestid) {
    return axios.get(`${baseURL}/services/createDemandeFromObj`, { params: {requestid}, responseType: 'arraybuffer'}).then(data => data);
}

/**
 * Check the request limitation for the user type
 * @param cni
 * @param type
 * @return {*}
 */
export function checkRequestLimitation({cni, type}) {
    const params = {cni, type};
    return axios.get(`${baseURL}/services/checkRequestLimitation`, { params }).then(({data}) => data);
}
