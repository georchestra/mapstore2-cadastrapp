
import { head } from 'lodash';

/**
 *
 * @param {object} configuration the configuration from `getConfiguration`
 * @returns {array} array of  {index , title, thumbnail}
 */
export function getBaseMapsFromConfig({ pdfbasemaptitles: titles, pdfbasemapthumbnails: previews} = {}) {

    return (titles || []).map(({value, key}) => ({
        title: value,
        index: key.split(".").reverse()[1], // need to take "0" from "pdf.baseMap.0.title" --> split --> reverse --> [title, 0, ...]. So I get the element at index 1 to get the number.
        thumbnail: head((previews || []).filter(({key: kk}) => kk.indexOf(key) === 0).map(({value: vv}) => vv))
    }));
}
