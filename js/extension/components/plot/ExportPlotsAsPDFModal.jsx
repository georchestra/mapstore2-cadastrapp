import React from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { PlotInformationRadio } from "@js/extension/components/information/Plot";
import {
    baseMapsSelector,
    getSelectedStyle
} from "@js/extension/selectors/cadastrapp";

export default connect(state => ({
    baseMaps: baseMapsSelector(state),
    selectedStyle: getSelectedStyle(state)
})
)(({show, onClose, parcelle, ...props}) => {
    const parcelles = parcelle.join(',');
    return (
        <Modal
            dialogClassName="cadastrapp-export-modal"
            show={show}
            onHide={onClose}>
            <Modal.Header closeButton>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{parcelles}</Tooltip>}>
                    <Modal.Title className={"cadastrapp-export-plots"}>{`Plot information - ${parcelles}`}</Modal.Title>
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body style={{minHeight: 100}}>
                <PlotInformationRadio isShown modalStyle={{display: 'flex', flexDirection: 'column'}} parcelle={parcelles} {...props}/>
            </Modal.Body>
        </Modal>
    );
});
