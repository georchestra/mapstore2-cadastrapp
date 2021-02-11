import React, { useState } from 'react';
import {
    Button,
    Radio,
    FormGroup
} from 'react-bootstrap';
import Spinner from "react-spinkit";
import Message from '@mapstore/components/I18N/Message';
import { createRelevePropriete, createReleveProprieteAsCSV } from '../../api';
import { downloadResponse } from '@js/extension/utils/download';


export default function PropertiesRadio({
    showParcelle = true,
    expanded,
    parcelle,
    data = [],
    selected = []
}) {

    let className = expanded ? "" : "collapse";
    const [useParcelle, setUseParcelle] = useState(showParcelle);
    const [format, setFormat] = useState('pdf');
    const [loading, setLoading] = useState(false);

    return (
        <div className={className}>
            <hr/>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                {showParcelle ? <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}><Message msgId={"cadastrapp.relevepropriete.data"}/>: </b>
                    <Radio checked={useParcelle} value={"true"} onChange={() => setUseParcelle(true)} inline>
                        <Message msgId={"cadastrapp.relevepropriete.partial"}/>
                    </Radio>s
                    <Radio checked={!useParcelle} value={"false"} onChange={() => setUseParcelle(false)} inline>
                        <Message msgId={"cadastrapp.relevepropriete.full"}/>
                    </Radio>
                </FormGroup> : null}
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}><Message msgId={"cadastrapp.relevepropriete.type.title"}/>:</b>
                    <Radio checked={format === 'pdf'} value="pdf" onChange={() => setFormat("pdf")} inline>
                        <Message msgId={"cadastrapp.relevepropriete.type.pdf"}/>
                    </Radio>
                    <Radio checked={format === 'csv'} value="csv" onChange={() => setFormat("csv")} inline>
                        <Message msgId={"cadastrapp.relevepropriete.type.csv"}/>
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
                                .filter(function onlyUnique(value, index, self) {
                                    return self.indexOf(value) === index;
                                })
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
                    <Message msgId={"cadastrapp.relevepropriete.export"}/>
                </Button>
            </div>
            <hr/>
        </div>);
}
