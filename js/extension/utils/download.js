import axios from '@mapstore/libs/ajax';
import uuidv1 from 'uuid/v1';
import {validateFeatureCoordinates} from "@mapstore/utils/MeasureUtils";
import {cadastreLayerIdParcelle} from "@js/extension/selectors/cadastrapp";
import {getMessageById} from "@mapstore/utils/LocaleUtils";
import {currentMessagesSelector} from "@mapstore/selectors/locale";
import {ANNOTATIONS, createAnnotationId} from '@mapstore/plugins/Annotations/utils/AnnotationsUtils';

export const toDownload = ({ fileName, mimeType }) => (response) => {
    const dataUrl = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
    const link = document.createElement('a');
    link.href = dataUrl;
    link.setAttribute('download', fileName ?? response?.headers?.fileName);
    document.body.appendChild(link);
    link.click();
};
//
export function downloadFileGet(url, downloadOptions) {
    return axios({
        url: url,
        method: 'GET',
        responseType: 'blob' // important
    }).then(toDownload(downloadOptions));
}

export function downloadResponse(response, { fileName = 'unknown' } = {}) {
    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let name = fileName;
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch.length > 2 && fileNameMatch[1]) {
            name = fileNameMatch[1].replace(/['"]/g, '');
        }
    }
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

/**
 * Converts cadastrapp selection into geoJson accepted by annotations
 * @param vectorLayer
 * @param state
 * @returns object
 */
export const convertFeaturesToAnnotationLayer = (vectorLayer, state) => {
    const id = createAnnotationId(uuidv1());
    return {
        type: "vector",
        features: [
            ...(vectorLayer?.features ?? []).map(feature => {
                const geomType = feature.geometry.type === 'MultiPolygon' ? 'Polygon' : feature.geometry.type;
                return {
                    type: 'Feature',
                    geometry: {
                        type: geomType,
                        coordinates: feature.geometry.type === 'MultiPolygon'
                            ? validateFeatureCoordinates({coordinates: feature.geometry.coordinates[0], type: 'Polygon'})
                            : validateFeatureCoordinates(feature.geometry),
                        textLabels: feature.geometry.textLabels
                    },
                    properties: {
                        id: uuidv1(),
                        isValidFeature: true,
                        geometryTitle: feature.properties[cadastreLayerIdParcelle(state)],
                        values: feature.properties?.values || [],
                        annotationType: geomType,
                        name: geomType
                    },
                    style: [{
                        ...feature.style,
                        type: feature.geometry.type,
                        id: uuidv1(),
                        geometry: null,
                        title: `${feature.geometry.type} Style`,
                        filtering: true
                    }]
                };
            })
        ],
        id,
        description: '',
        title: getMessageById(currentMessagesSelector(state), "cadastrapp.result.parcelle.selectedPlots"),
        style: {},
        rowViewer: ANNOTATIONS,
        visibility: true
    };
};
