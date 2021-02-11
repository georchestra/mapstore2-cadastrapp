import React, { useState, useEffect } from 'react';
import Spinner from "react-spinkit";
import Message from '@mapstore/components/I18N/Message';
import Modal from '@mapstore/components/misc/Modal';
import { Button, FormGroup, Radio } from 'react-bootstrap';

import {
    getBatimentsByParcelle,
    exportLotsAsPDF,
    exportLotsAsCSV
} from '../../api';
import { downloadResponse } from '../../utils/download';


export default function BundleInformationModal({ show, parcelle, onClose }) {
    const [loading, setLoading] = useState(false);
    const [format, setFormat ] = useState("pdf");
    const [letters, setLetters] = useState([]);
    const [firstOpen, setFirstOpen] = useState(false);
    useEffect(() => {
        if (show && parcelle) {
            setFirstOpen(false);
            getBatimentsByParcelle({parcelle}).then(data => setLetters(data));
        }
    }, [show, parcelle]);
    const [letter, setLetter] = useState();
    useEffect(() => {
        if (letters.length > 0 && !firstOpen) {
            setFirstOpen(true);
            setLetter(letters[0].dnubat);
        }
    }, [letters]);
    return (<Modal
        style={{ maxHeight: "100%", overflowY: "auto", zIndex: 10000 }}
        dialogClassName="cadastrapp-modal"
        show={show}
        onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title><Message msgId={'cadastrapp.lots.title'}/> { parcelle }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div><Message msgId={'cadastrapp.lots.batiments'}/></div>
            {letters.map(({ dnubat }) => <Button bsStyle={letter === dnubat ? "primary" : undefined} onClick={() => setLetter(dnubat)}>{dnubat}</Button>)}
        </Modal.Body>
        <FormGroup>
            <b style={{ "float": "left", width: 150, marginRight: 15 }}><Message msgId={'cadastrapp.lots.type.title'}/>:</b>
            <Radio checked={format === 'pdf'} value="pdf" onChange={() => setFormat("pdf")} inline>
                <Message msgId={'cadastrapp.lots.type.pdf'}/>
            </Radio>
            <Radio checked={format === 'csv'} value="csv" onChange={() => setFormat("csv")} inline>
                <Message msgId={'cadastrapp.lots.type.csv'}/>
            </Radio>
        </FormGroup>
        <Modal.Footer>
            <Button
                disabled={loading}
                bsStyle="primary"
                onClick={() => {
                    setLoading(true);
                    (format === "csv" ? exportLotsAsCSV({ parcelle, dnubat: letter }) : exportLotsAsPDF({ parcelle, dnubat: letter }))
                        .then(response => {
                            downloadResponse(response);
                            setLoading(false);
                        })
                        .catch(() => {
                            setLoading(false);
                        });
                }}
            >
                {loading ? <Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /> : null} Export</Button>
        </Modal.Footer>
    </Modal>);
}
