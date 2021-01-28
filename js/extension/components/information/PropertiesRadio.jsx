import React, { useState } from 'react';
import {
    Button,
    Radio,
    FormGroup
} from 'react-bootstrap';
import Spinner from "react-spinkit";

import { createRelevePropriete, createReleveProprieteAsCSV } from '../../api';
import { downloadResponse } from '@js/extension/utils/download';


export default function PropertiesRadio({
    expanded,
    parcelle,
    data = [],
    selected = []
}) {

    let className = expanded ? "" : "collapse";
    const [useParcelle, setUseParcelle] = useState(true);
    const [format, setFormat] = useState('pdf');
    const [loading, setLoading] = useState(false);

    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Data to extract: </b>
                    <Radio checked={useParcelle} value={"true"} onChange={() => setUseParcelle(true)} inline>
                        Only this plot
                    </Radio>s
                    <Radio checked={!useParcelle} value={"false"} onChange={() => setUseParcelle(false)} inline>
                        All Properties
                    </Radio>
                </FormGroup>
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Choose output format:</b>
                    <Radio checked={format === 'pdf'} value="pdf" onChange={() => setFormat("pdf")} inline>
                        Export as PDF
                    </Radio>
                    <Radio checked={format === 'csv'} value="csv" onChange={() => setFormat("csv")} inline>
                        Export as CSV
                    </Radio>
                </FormGroup>
            </div>
            <div
                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    disabled={selected.length === 0 || loading}
                    onClick={() => {
                        setLoading(true);
                        const handler = format === 'csv' ? createReleveProprieteAsCSV : createRelevePropriete;
                        handler({
                            parcelleId: useParcelle ? parcelle : undefined,
                            compteCommunal: data
                                .filter((_, i) => selected.includes(i))
                                .map(({ comptecommunal }) => comptecommunal)
                                .join(',')
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