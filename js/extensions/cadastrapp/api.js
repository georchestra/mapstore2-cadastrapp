import axios from '../../../MapStore2/web/client/libs/ajax';

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

export function getParcelle(parcelle) {
    return axios.post(`${baseURL}/services/getParcelle`, {parcelle}).then(({data}) => data);
}
