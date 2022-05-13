import axios from '@mapstore/libs/ajax';

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
