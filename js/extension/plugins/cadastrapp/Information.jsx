
import React from 'react';
import {connect} from 'react-redux';
import Modal from '@mapstore/components/misc/Modal';
import { getInformationItems, getAuthLevel, baseMapsSelector, getSelectedStyle } from '../../selectors/cadastrapp';
import { clearInformation } from '../../actions/cadastrapp';


import InformationPanelContainer from '../../components/information/InformationPanelContainer';

function InformationModal({ items = [], onClose, authLevel, additionalData }) {
    return (<Modal
        style={{ maxHeight: "100%", overflowY: "auto", minWidth: "85%" }}
        dialogClassName="cadastrapp-modal cadastrapp-information-modal"
        show={items.length > 0}
        onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Information Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InformationPanelContainer authLevel={authLevel} items={items} additionalData={additionalData}/>
        </Modal.Body>
    </Modal>);
}

export default connect(state => {
    const informationData = getInformationItems(state);
    const authLevel = getAuthLevel(state);
    const baseMaps = baseMapsSelector(state);
    const selectedStyle = getSelectedStyle(state);
    return {
        authLevel,
        baseMaps,
        selectedStyle,
        additionalData: { baseMaps, selectedStyle},
        items: Object.keys(informationData).map(k => ({
            parcelle: k,
            ...informationData[k]
        }))
    };
}, {
    onClose: clearInformation
}
)(InformationModal);
