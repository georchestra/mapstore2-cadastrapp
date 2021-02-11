import React, { useState, useEffect} from 'react';
import {
    Radio,
    FormGroup,
    ButtonGroup,
    Button,
    Tooltip,
    OverlayTrigger,
    Glyphicon
} from "react-bootstrap";
import Spinner from "react-spinkit";
import Message from '@mapstore/components/I18N/Message';
import PropertiesRadio from '../PropertiesRadio';
import { exportLotsAsCSV, exportLotsAsPDF } from '../../../api';
import { downloadResponse } from '../../../utils/download';

// select options to download full bundle
function BundleRadio({ show, dnubat, parcelle}) {
    let className = show ? "" : "collapse";
    const [format, setFormat] = useState('pdf');
    const [loading, setLoading] = useState(false);
    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}><Message msgId={'cadastrapp.lots.type.title'}/>:</b>
                    <Radio checked={format === 'pdf'} value="pdf" onChange={() => setFormat("pdf")} inline>
                        <Message msgId={'cadastrapp.lots.type.pdf'}/>
                    </Radio>
                    <Radio checked={format === 'csv'} value="csv" onChange={() => setFormat("csv")} inline>
                        <Message msgId={'cadastrapp.lots.type.csv'}/>
                    </Radio>
                </FormGroup>
            </div>
            <div
                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);
                        const handler = format === 'csv' ? exportLotsAsCSV : exportLotsAsPDF;
                        handler({
                            dnubat,
                            parcelle
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

export default function BuildingsButtons({
    setShowDescription = () => {},
    selected = [],
    data = [],
    dnubat,
    parcelle

}) {
    let [propertiesSelected, setPropertiesSelected] = useState(false);
    let [bundleSelected, setBundleSelected] = useState(false);

    const onPropertiesClick = () => {
        setBundleSelected(false);
        setPropertiesSelected(!propertiesSelected);
    };

    const onBundleClick = () => {
        setPropertiesSelected(false);
        setBundleSelected(!bundleSelected);
    };
    // auto close panel if no row has been selected
    useEffect(() => {
        if (selected.length === 0) {
            setPropertiesSelected(false);
        }
    }, [selected]);

    return (<>
        <ButtonGroup className="pull-right">
            <OverlayTrigger placement="bottom" overlay={<Tooltip><Message msgId={'cadastrapp.duc.releve.depropriete'}/></Tooltip>}>
                <Button
                    disabled={selected.length === 0}
                    bsStyle={propertiesSelected ? "primary" : "default"}
                    onClick={onPropertiesClick}>
                    <Glyphicon glyph="th-list" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip><Message msgId={'cadastrapp.duc.batiment_descriptif'}/></Tooltip>}>
                <Button
                    onClick={() => setShowDescription(true)}
                    disabled={selected.length === 0}>
                    <Glyphicon glyph="info-sign" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip><Message msgId={'cadastrapp.duc.batiment_bundle'}/></Tooltip>}>
                <Button
                    bsStyle={bundleSelected ? "primary" : "default"}
                    onClick={onBundleClick}>
                    <Glyphicon glyph="compressed" /></Button>
            </OverlayTrigger>
        </ButtonGroup>
        <PropertiesRadio parcelle={parcelle} expanded={propertiesSelected} data={data} selected={selected} />
        <BundleRadio
            dnubat={dnubat}
            parcelle={parcelle}
            show={bundleSelected} />
    </>);
}
