import React from 'react';
import MapView from '@mapstore/components/widgets/widget/MapView';
import { ResizableBox } from 'react-resizable';

function getSufBatCalcPercentage(surfaceTotal, surfaceBatie) {
    var percent = 0;
    if (surfaceTotal && surfaceBatie && surfaceTotal !== 0 && surfaceBatie !== 0) {
        percent = ((surfaceBatie / surfaceTotal) * 100).toFixed(1);
    }
    return percent;
}
// NOTE: localization here was not present
export default function Content({layers = [], map, proprietaire = [], info = {}, parcelleData = [], configuration = {}, hookRegister}) {
    const { comptecommunal, dcntpa_sum, sigcal_sum, sigcalb_sum } = info;
    const { organisme, dateValiditeEDIGEO, dateValiditeMajic} = configuration;
    return (<div id="cadastrapp-landed-prop-print-page" className="cadastrapp-landed-prop-print-page">
        <div className="page">
            <div id="titre">
                <p></p><h1>Information sur une unité foncière</h1><p></p>
            </div>
            <ResizableBox height={350} maxConstraints={[Infinity, 600]} resizeHandle="s" axis="y">
                <MapView id="landed-property-map"
                    hookRegister={hookRegister}
                    layers={layers}
                    map={{
                        ...map
                    }} />
            </ResizableBox>
            <br />
            <div id="informationgenerale">
                <div className="proprieteaire">
                    {comptecommunal ? <div className="propTitle">{proprietaire.length > 1 ? "Propriétaires" : "Propriétaire"}  ( {comptecommunal} )</div> : null}
                    <div className="propList">{proprietaire.map(({ app_nom_usage: name }) => <div>{name}</div>)}</div>
                    <div className="datauflist">
                        {dcntpa_sum
                            ? <div className="datauf"><span className="dataufLabel">Contenance DGFIP de l'UF : </span>{((dcntpa_sum === null) ? 0 : dcntpa_sum.toLocaleString())} m²</div>
                            : null}
                        {sigcalb_sum !== undefined || sigcal_sum !== undefined
                            ? <>
                                <div className="datauf"><span className="dataufLabel">Surface parcellaire calculée : </span>{((sigcal_sum === null) ? 0 : sigcal_sum.toLocaleString())} m²</div>
                                <div className="datauf"><span className="dataufLabel">Surface bâtie calculée : </span>{((info.sigcalb_sum === null) ? 0 : sigcalb_sum.toLocaleString()) } m²</div>
                                <div className="datauf"><span className="dataufLabel">Pourcentage surface bâtie calculée : </span>{getSufBatCalcPercentage(sigcal_sum, sigcalb_sum)} %</div>
                            </>
                            : null}
                    </div>
                </div>
            </div>
            <div id="composition">
                <div className="info"><b>Cette unité foncière est composée de {parcelleData.length} {parcelleData.length > 1 ? 'parcelles' : 'parcelle'}.</b></div>
                <div className="info">La somme des surfaces parcellaires calculée est égale à {parcelleData.reduce((sum, { surfc }) => sum + (surfc ?? 0), 0)} m².</div></div>
            <div id="parcelles">
                {parcelleData.map(({parcelle, surfc}) => <div className="data"><span className="dataLabel">{parcelle}</span>{(surfc ?? 0).toLocaleString()} m²</div>)}
            </div>
            <br />
            <div id="services">
                <div>Données foncières valides au {dateValiditeMajic} - Données cartographiques valides au {dateValiditeEDIGEO}</div>
                <div>{organisme}</div>
            </div>
        </div>
    </div>);
}
