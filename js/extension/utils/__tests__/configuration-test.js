import expect from 'expect';

const testConfiguration = {
    "dateValiditeEDIGEO": "01/01/2018",
    "cadastreWMSURL": "https://georchestra.geo-solutions.it/geoserver/wms",
    "cadastreWMSLayerName": "qgis:cadastrapp_parcelle",
    "organisme": "Un service fourni par ",
    "cnil1RoleName": "ROLE_EL_APPLIS_CAD_CNIL1",
    "cadastreWFSURL": "https://georchestra.geo-solutions.it/geoserver/wfs",
    "maxRequest": "8",
    "pdfbasemaptitles": [
        {
            "value": "Cadastre",
            "key": "pdf.baseMap.0.title"
        },
        {
            "value": "Cadastre Noir et Blanc",
            "key": "pdf.baseMap.1.title"
        }
    ],
    "minNbCharForSearch": "3",
    "pdfbasemapthumbnails": [
        {
            "value": "https://public.sig.rennesmetropole.fr/ressources/app/georchestra/cadastrapp/images/cadastre.png",
            "key": "pdf.baseMap.0.title.thumbnail"
        },
        {
            "value": "https://public.sig.rennesmetropole.fr/ressources/app/georchestra/cadastrapp/images/cadastre_nb.png",
            "key": "pdf.baseMap.1.title.thumbnail"
        }
    ],
    "cadastreLayerIdParcelle": "geo_parcelle",
    "cnil2RoleName": "ROLE_EL_APPLIS_CAD_CNIL2",
    "minParacelleIdLength": "14",
    "dateValiditeMajic": "01/01/2018",
    "uFWFSURL": "https://georchestra.geo-solutions.it/geoserver/wfs",
    "cadastreWFSLayerName": "qgis:cadastrapp_parcelle",
    "uFWFSLayerName": "qgis:cadastrapp_unite_fonciere"
};
import { getBaseMapsFromConfig } from '../configuration';

describe('configuration utils', () => {
    it("getBaseMapsFromConfig not failing on missing config", () => {
        const baseMaps = getBaseMapsFromConfig();
        expect(baseMaps).toEqual([]);
    });
    it("getBaseMapsFromConfig", () => {
        const baseMaps = getBaseMapsFromConfig(testConfiguration);
        expect(baseMaps).toEqual([
            { title: 'Cadastre', index: '0', thumbnail: 'https://public.sig.rennesmetropole.fr/ressources/app/georchestra/cadastrapp/images/cadastre.png' },
            { title: 'Cadastre Noir et Blanc', index: '1', thumbnail: 'https://public.sig.rennesmetropole.fr/ressources/app/georchestra/cadastrapp/images/cadastre_nb.png' }
        ]);
    });
    it("getBaseMapsFromConfig keeps order by key", () => {
        const baseMaps = getBaseMapsFromConfig({
            ...testConfiguration,
            pdfbasemaptitles: [...testConfiguration.pdfbasemaptitles].reverse()
        });
        expect(baseMaps).toEqual([
            { title: 'Cadastre', index: '0', thumbnail: 'https://public.sig.rennesmetropole.fr/ressources/app/georchestra/cadastrapp/images/cadastre.png' },
            { title: 'Cadastre Noir et Blanc', index: '1', thumbnail: 'https://public.sig.rennesmetropole.fr/ressources/app/georchestra/cadastrapp/images/cadastre_nb.png' }
        ]);
    });
});
