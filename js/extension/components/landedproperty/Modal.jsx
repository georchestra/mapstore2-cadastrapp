import React, { useState, useEffect } from 'react';
import Spinner from "react-spinkit";

import '../../ficheUniteFonciere.css';
import css from 'raw-loader!../../ficheUniteFonciere.css.txt';
import Message from '@mapstore/components/I18N/Message';
import bbox from '@turf/bbox';

import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Content from './Content';
import { getInfoUniteFonciere, getProprietaire, getParcelle } from '@js/extension/api/api';

function printPageArea(areaID) {
    var printContent = document.getElementById(areaID);
    // var WinPrint = window.open('', '', 'width=900,height=650');
    var WinPrint = window.open('', '_blank');
    WinPrint.document.write(printContent.innerHTML);
    const styleTag = WinPrint.document.createElement('style');
    styleTag.innerHTML = css; // TODO: add media type and other parts;
    WinPrint.document.title = "Information sur une unité foncière";
    WinPrint.document.getElementsByTagName('body')[0].setAttribute('class', 'cadastrapp-landed-prop-print-page');
    WinPrint.document.getElementsByTagName('head')[0].appendChild(styleTag);
    const sourceCanvas = document.querySelector(`#${areaID} .ol-viewport canvas`);
    const destCtx = WinPrint.document.querySelector('canvas').getContext('2d');
    destCtx.drawImage(sourceCanvas, 0, 0);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
}

export default function LandedPropertyInformationModal({
    show,
    onClose,
    parcelle,
    configuration,
    map,
    layers
}) {
    const [hooks, setHooks] = useState({});
    const hookRegister = {
        registerHook: (name, hook) => {
            setHooks({...hooks, [name]: hook});
        },
        getHook: (name) => hooks[name],
        executeHook: (hookName, existCallback, dontExistCallback) => {
            const hook = hooks[hookName];
            if (hook) {
                return existCallback(hook);
            }
            if (dontExistCallback) {
                return dontExistCallback();
            }
            return null;
        }
    };
    const [zoomed, setZoomed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [proprietaires, setProprietaires] = useState();
    const [info, setInfo] = useState();
    const [parcelleData, setParcelleData] = useState();
    useEffect(() => {
        if (parcelle) {
            setLoading(true);
            getInfoUniteFonciere({ parcelle: parcelle?.parcelle }).then((ufInfo) => {
                if (!ufInfo) { // as for of ficheUniteFonctiere.js, do action if data not received
                    return;
                }
                const { comptecommunal, uf } = ufInfo;
                setInfo(ufInfo);
                getProprietaire({ details: 2, comptecommunal })
                    .then(result => setProprietaires(result))
                    // eslint-disable-next-line no-console
                    .catch((e) => {console.log(e);}); // TODO: notify error
                getParcelle({ unitefonciere: uf }).then(setParcelleData);
            });
        }
    }, [parcelle]);
    useEffect(() => {
        if (loading && info && proprietaires && parcelleData) {
            setLoading(false);
        }
    }, [loading, info, proprietaires, parcelleData]);
    useEffect(() => {
        const hook = hooks.ZOOM_TO_EXTENT_HOOK;
        if (!zoomed && hook)  {
            const fBbox = bbox({ type: "FeatureCollection", features: parcelle?.feature ? [parcelle?.feature] : [] } );
            if (parcelle?.feature) {
                hook(fBbox, { crs: "EPSG:4326"});
            }
            setZoomed(true);
        }
    }, [hooks, parcelle, zoomed]);
    return (<Modal
        style={{ maxHeight: "100%", overflowY: "auto", zIndex: 10000 }}
        dialogClassName="cadastrapp-modal cadastrapp-landed-property-modal"
        show={show}
        onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title><Message msgId={'cadastrapp.uniteFonciere'}/></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 700, overflow: "auto" }} >
            <Content
                map={map}
                hookRegister={hookRegister}
                layers={layers}
                info={info}
                configuration={configuration}
                proprietaires={proprietaires}
                parcelle={parcelle}
                parcelleData={parcelleData}/>
        </Modal.Body>
        <Modal.Footer>
            <Button
                disabled={loading}
                bsStyle="primary"
                onClick={() => {
                    printPageArea("cadastrapp-landed-prop-print-page");
                }}
            >
                {loading ? <Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /> : null}<Message msgId={'cadastrapp.menu.tooltips.imprimer'}/></Button>
        </Modal.Footer>
    </Modal>);
}
