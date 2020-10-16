import axios from '../../../MapStore2/web/client/libs/ajax';

let baseURL = '/cadastrapp/';

export function setBaseURL(url) {
    baseURL = url;
}

export function getConfiguration() {
    return axios.get(`${baseURL}/services/getConfiguration`);
}
export function getManifest() {
    return axios.get("/mapfishapp/ws/addons/cadastrapp/manifest.json");
}
