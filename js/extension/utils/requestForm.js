import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

export const DEFAULT_REQUEST_OBJ = {
    type: '',
    lastname: '',
    firstname: '',
    adress: '',
    cni: '',
    commune: '',
    codepostal: '',
    mail: '',
    parcelleIds: '', // Request object by Plot Id - ${municipalAccountId}|${parcelSlip}|${propertyStatement}
    comptecommunaux: '',  // Request object by Owner Id - ${ownerId}|${parcelSlip}|${propertyStatement}
    coproprietes: '', // Request object by Co-owners - ${municipalAccountId}|${plotId}|${parcelSlip}|${propertyStatement}
    parcelles: '',   // Request object by Plot ${commune}|${section}|${number}|${parcelSlip}|${propertyStatement}
    proprietaires: '', // Request object by Owner ${commune}|${proprietaire}|${parcelSlip}|${propertyStatement}
    proprietaireLots: '', // Request object by Owner ${commune}|${section}|${number}|${proprietaire}|${parcelSlip}|${propertyStatement}
    responseby: 1, // Give document by 1 - Counter|2 - Courier|3 - Mail
    askby: 1 // Request ask by 1 - Counter|2 - Courier|3 - Mail
};

export const DEFAULT_MAX_REQUEST = 8;

export const USER_TYPE_OPTIONS = [
    { value: 'A', label: 'Administration' },
    { value: 'P1', label: 'P1 - User with Rights' },
    { value: 'P2', label: 'P2 - Representative' },
    { value: 'P3', label: 'P3 - Normal user' }
];

const generateParam = (object) => {
    let parameters = [];
    for (let property in object) {
        if (object.hasOwnProperty(property)) {
            if (isArray(object[property])) {
                object[property].forEach(t=> parameters.push(encodeURI(property + '=' + t)));
            } else {
                parameters.push(encodeURI(property + '=' + object[property]));
            }
        }
    }
    return parameters.join('&');
};

const checkBoxToBinary = (checked) => checked ? 1 : 0;

export const formulatePrintParams = (requestFormData) => {
    const {comptecommunaux, proprietaires, parcelleIds, parcelles, coproprietes, proprietaireLots, ...rest} = requestFormData;
    let printRequestTemp = {...rest};
    if (!isEmpty(comptecommunaux)) {
        printRequestTemp = { ...printRequestTemp,
            comptecommunaux: Object.keys(comptecommunaux).map(key=>{
                const {accountId = '', propStatement = false, parcelSlip = false} = comptecommunaux[key];
                return accountId + "|" + checkBoxToBinary(parcelSlip) + "|" + checkBoxToBinary(propStatement);
            })
        };
    }
    if (!isEmpty(parcelles)) {
        printRequestTemp = { ...printRequestTemp,
            parcelles: Object.keys(parcelles).map(key=>{
                const {commune = {}, section = {}, plot = {},  parcelSlip = false, propStatement = false} = parcelles[key];
                return (commune?.cgocommune || '') + "|" + (section?.ccosec || '') + '|' + (plot?.dnupla || '') + '|' + checkBoxToBinary(parcelSlip) + "|" + checkBoxToBinary(propStatement);
            })
        };
    }
    if (!isEmpty(coproprietes)) {
        printRequestTemp = { ...printRequestTemp,
            coproprietes: Object.keys(coproprietes).map(key=>{
                const {accountId = '', plotId = '', parcelSlip = false, propStatement = false} = coproprietes[key];
                return accountId + "|" + plotId + '|' + checkBoxToBinary(parcelSlip) + "|" + checkBoxToBinary(propStatement);
            })
        };
    }
    if (!isEmpty(parcelleIds)) {
        printRequestTemp = { ...printRequestTemp,
            parcelleIds: Object.keys(parcelleIds).map(key=>{
                const {accountId = '', parcelSlip = false, propStatement = false} = parcelleIds[key];
                return accountId + "|" + checkBoxToBinary(parcelSlip) + "|" + checkBoxToBinary(propStatement);
            })
        };
    }
    if (!isEmpty(proprietaires)) {
        printRequestTemp = { ...printRequestTemp,
            proprietaires: Object.keys(proprietaires).map(key=>{
                const {commune = {}, proprietaire = {}, parcelSlip = false, propStatement = false} = proprietaires[key];
                return (commune.cgocommune || '') + "|" + (proprietaire.app_nom_usage || '') + '|' + checkBoxToBinary(parcelSlip) + "|" + checkBoxToBinary(propStatement);
            })
        };
    }
    if (!isEmpty(proprietaireLots)) {
        printRequestTemp = { ...printRequestTemp,
            proprietaireLots: Object.keys(proprietaireLots).map(key=>{
                const {commune = {}, section = {}, plot = {}, proprietaire = {}, parcelSlip = false, propStatement = false} = proprietaireLots[key];
                return (commune?.cgocommune || '') + "|" + (section?.ccosec || '') + '|' + (plot?.dnupla || '') + "|" + proprietaire.app_nom_usage || '' + '|' + checkBoxToBinary(parcelSlip) + "|" + checkBoxToBinary(propStatement);
            })
        };
    }
    return generateParam(printRequestTemp);
};
