import React, {useState} from 'react';
import { createBordereauParcellaire } from '../../api';
import tinycolor from 'tinycolor2';

import Message from '@mapstore/components/I18N/Message';
import { Table, Button, Glyphicon, FormGroup, Radio } from 'react-bootstrap';

import { DropdownList } from 'react-widgets';
import { downloadResponse } from '@js/extension/utils/download';
import Spinner from "react-spinkit";

const ListItem = ({ item = {} }) => (
    <span>
        <img style={{
            width: "50px",
            height: "50px",
            borderRadius: "25px",
            margin: "5px 10px 5px 0"
        }} src={item.thumbnail} /><span>{item.title}</span>
    </span>
);

const toParams = (selectedStyle) => {
    let {
        fillOpacity: opacity,
        fillColor: fillcolor,
        weight: strokewidth,
        color: strokecolor
    } = selectedStyle;
    return {
        opacity,
        fillcolor: tinycolor(fillcolor).toHex(),
        strokewidth,
        strokecolor: tinycolor(strokecolor).toHex()
    };
};

function PlotInformationRadio({
    isCNIL1,
    isCNIL2,
    baseMaps = [],
    parcelle,
    selectedStyle = {},
    isShown
}) {
    const [baseMap, setBaseMap] = useState();
    const [personalData, setPersonalData] = useState("0");
    const [loading, setLoading] = useState(false);
    let className = isShown ? "" : "collapse";
    const {
        opacity,
        fillcolor,
        strokewidth,
        strokecolor
    } = toParams(selectedStyle);

    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                {isCNIL1 || isCNIL2 ? <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Owners Information: </b>
                    <Radio inline checked={personalData === "0"} onChange={() => setPersonalData("0")} value="0">
                        Without owner
                    </Radio>
                    <Radio inline checked={personalData === "1"} onChange={() => setPersonalData("1")} value="1">
                        With owner
                    </Radio>
                </FormGroup> : null}
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15, width: 300 }}>Choose basemap:</b>
                    <div style={{ "float": "left" }}>
                        <DropdownList style={{width: 300}} value={baseMap} defaultValue={baseMaps[0]} onSelect={v => setBaseMap(v)} textField="title" data={baseMaps} itemComponent={ListItem} />
                    </div>
                </FormGroup>
            </div>
            <div

                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);
                        createBordereauParcellaire({
                            fillcolor,
                            opacity,
                            strokecolor,
                            strokewidth,
                            parcelle,
                            personaldata: personalData,
                            basemapindex: 0 // TODO: get the list from config and sent the relative index
                        }).then((response) => {
                            setLoading(false);
                            downloadResponse(response);
                        }).catch(() => {
                            setLoading(false); // TODO: handle error
                        });
                    }}
                    className="pull-right">
                    {loading ? <Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /> : null}
                    Export
                </Button>
            </div>
            <hr></hr>
        </div>);
}
export default function Plot({
    isCNIL1,
    isCNIL2,
    selectedStyle,
    parcelle,
    fiuc,
    onGeneratePlotInformation = () => {},
    baseMaps = []
}) {
    let [isPlotShown, setIsPlotShown] = useState(false);
    const handlePlotClick = () => {
        setIsPlotShown(!isPlotShown);
    };
    if (!fiuc) {
        return "Loading";
    }
    return (<>
        <div style={{ margin: 10 }}>
            <Button
                bsStyle={isPlotShown ? "primary" : "default"}
                onClick={handlePlotClick}>
                <Glyphicon style={{ marginRight: 4 }} glyph="1-pdf" />
            Plot Information
            </Button>
        </div>
        <PlotInformationRadio isCNIL1={isCNIL1} isCNIL2={isCNIL2} parcelle={parcelle} isShown={isPlotShown} baseMaps={baseMaps} onGeneratePlotInformation={onGeneratePlotInformation} selectedStyle={selectedStyle}/>
        <Table condensed>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Valeur</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Town</td><td>{ fiuc.libcom + ' (' + fiuc.cgocommune + ')' }</td></tr>
                <tr><td>Section</td><td>{ fiuc.ccopre + fiuc.ccosec }</td></tr>
                <tr><td>Plot</td><td>{ fiuc.dnupla }</td></tr>
                <tr><td>Voie</td><td>{ fiuc.ccoriv }</td></tr>
                <tr><td>Address</td><td>{ fiuc.dnvoiri + fiuc.dindic + ' ' + fiuc.cconvo + fiuc.dvoilib}</td></tr>
                <tr><td>Size DGFIP in m2</td><td>{ fiuc?.dcntpa?.toLocaleString()}</td></tr>
                <tr><td>Size in m2</td><td>{ fiuc?.surfc?.toLocaleString()}</td></tr>
                <tr><td>Plot with building</td><td><Message msgId={fiuc.gparbat === '1' ? 'yes' : 'no'} /></td></tr>
                <tr><td>Urban region</td><td><Message msgId={fiuc.gurbpa === 'U' ? 'yes' : 'no'} /></td></tr>
            </tbody>
        </Table>
    </>);
}
