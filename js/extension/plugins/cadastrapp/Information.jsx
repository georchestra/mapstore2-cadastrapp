
import React from 'react';
import {connect} from 'react-redux';
import { Modal } from 'react-bootstrap';
import {
    getInformationItems,
    getAuthLevel,
    baseMapsSelector,
    getSelectedStyle,
    informationLoadingCountSelector,
    infoLoadingSelector
} from '../../selectors/cadastrapp';
import { clearInformation } from '../../actions/cadastrapp';
import Spinner from "react-spinkit";
import Message from "@mapstore/components/I18N/Message";


import InformationPanelContainer from '../../components/information/InformationPanelContainer';

function InformationModal({ items = [], onClose, authLevel, additionalData, loadingCount, infoLoading }) {
    return (<Modal
        style={{ maxHeight: "100%", overflowY: "auto", minWidth: "85%" }}
        dialogClassName="cadastrapp-modal cadastrapp-information-modal"
        show={items.length > 0}
        onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title><Message msgId={"cadastrapp.result.parcelle.fiche"}/>
                {loadingCount ? <span style={{ "float": "right", marginRight: 10 }}>({loadingCount} more)<Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /></span> : null}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InformationPanelContainer infoLoading={infoLoading} authLevel={authLevel} items={items} additionalData={additionalData}/>
        </Modal.Body>
    </Modal>);
}

export default connect(state => {
    const informationData = getInformationItems(state);
    const authLevel = getAuthLevel(state);
    const baseMaps = baseMapsSelector(state);
    const selectedStyle = getSelectedStyle(state);
    const loadingCount = informationLoadingCountSelector(state);
    const infoLoading = infoLoadingSelector(state);
    return {
        authLevel,
        loadingCount,
        baseMaps,
        selectedStyle,
        additionalData: { baseMaps, selectedStyle},
        infoLoading,
        items: Object.keys(informationData).map(k => ({
            parcelle: k,
            ...informationData[k]
        }))
    };
}, {
    onClose: clearInformation
}
)(InformationModal);
