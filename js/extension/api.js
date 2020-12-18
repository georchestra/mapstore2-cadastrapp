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

export function getParcelle({ parcelle, cgocommune, dvoilib, dnvoiri, dindic}) {
    return axios.get(`${baseURL}/services/getParcelle`, { params: {parcelle, cgocommune, dvoilib, dnvoiri, dindic} }).then(({data}) => data);
}

